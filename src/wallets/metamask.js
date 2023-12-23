import app from '@/main'
import router from '@/router'

// import defaults from '@/configs/defaults'
// import { ethers } from 'ethers'
import api from "@/services/api"
import store from "@/store"
import { notification } from '@/plugins'
import { ElLoading } from 'element-plus'


// GET PROVIDER
function getProvider() {
	try {
		if(window.ethereum?.providers) {
			const metamaskProvider = window.ethereum.providers.find((provider) => provider.isMetaMask);
			if(metamaskProvider) return metamaskProvider;
		}
		if(window.ethereum?.isMetaMask) {
			return window.ethereum;
		}

		if(app.config.globalProperties.device.type.mobile) {
			notification({
				title: "Mobile App",
				message:
					'First of all, you have to install the <a href="https://metamask.io/" target="_blank" class="text-decoration-underline">MetaMask mobile app</a>.' +
					"<br> Then you can use MetaMask mobile app browser!",
				dangerouslyUseHTMLString: true,
				type: "warning",
				duration: 5000,
			});
		} else {
			notification({
				title: "MetaMask Not Found",
				message:
					'First of all, you have to visit the <a href="https://metamask.io/" target="_blank" class="text-decoration-underline">MetaMask website</a>.' +
					"<br> Click on the “Download” option to install the MetaMask wallet.",
				dangerouslyUseHTMLString: true,
				type: "warning",
				duration: 5000,
			});
		}
	} catch(err) {
		console.log(err);
	}
	return undefined;
}

// CONNECT WALLET
async function connectWallet() {
  let loading = show_loading();
	try {
		const provider = getProvider();
		if(provider && isDefaultNetwork()) {
			const metamaskAccounts = await provider.request({ method: "eth_requestAccounts" });
			let accountExists = await getAccount(metamaskAccounts);
			if(accountExists) setWatchers();
			loading.close();
			return accountExists;
		}
	} catch (err) {
		console.log(err);
		notification({
			title: "OOPS!",
			message: "Something went wrong, please try again.",
			type: "error",
			duration: 3000,
		});
	}
	loading.close();
	return false;
}

// SET WATCHERS
function setWatchers() {
	getProvider().on('accountsChanged', async (metamaskAccounts) => {
		let connection = store.getters.getConnectionStore;
		if(connection && connection.is_connected && metamaskAccounts.length > 0 && metamaskAccounts[0] != connection.selectedAddress) {
			await getAccount(metamaskAccounts);
			router.go();
		} else {
			await disconnectWallet();
		}
	});

	getProvider().on('chainChanged', async () => {
		let connection = store.getters.getConnectionStore;
		if(connection && connection.is_connected) {
			await disconnectWallet();
		}
	});
}

// GET ACCOUNT
async function getAccount(metamaskAccounts) {
	const notification = app.config.globalProperties.notif;
	if(metamaskAccounts.length > 0) {
		const currentAccount = metamaskAccounts[0];
		// Send to Server via API
		let apiResponse = await api.post_account_connect({ account_address: currentAccount });
		if(apiResponse.data.done) {
			store.commit('setConnectionStore', {
				is_connected: true,
				connectedWallet: 'metamask',
				selectedAddress: currentAccount,
				accessToken: apiResponse.data.result[0].accessToken,
				expirationDate: apiResponse.data.result[0].expirationDate
			});
			store.commit('setAccountStore', apiResponse.data.result[0]);
			notification({
				title: "SUCCESS!",
				message:
					"You have successfully connected Tezuka.io with MetaMask wallet." +
					`<br>Account: ${app.config.globalProperties.utils.truncate(currentAccount, 12)}`,
				dangerouslyUseHTMLString: true,
				type: "success",
				duration: 3000,
				onClose: () => { router.go() }
			});
			return true;
		} else {
			store.commit('resetConnectionStore', { is_connected: false });
			store.commit('setAccountStore', null);
			notification({
				title: "Server apiResponse!",
				message: apiResponse.data.message,
				type: apiResponse.data.message_type,
				duration: 3000,
				onClose: () => { router.go() }
			});
			return false;
		}
	} else {
		store.commit('resetConnectionStore', { is_connected: false });
		store.commit('setAccountStore', null);
		notification({
			title: "No MetaMask Account Detected!",
			message:
				"No accounts were found connected to your MetaMask wallet.",
			dangerouslyUseHTMLString: true,
			type: "error",
			duration: 3000,
		});
		return false;
	}
}

// IS DAFAULT NETWORK
function isDefaultNetwork() {
	try {
		const defaultChain = app.config.globalProperties.defaultchain;
		if(getProvider()?.chainId === `0x${defaultChain.chainId.toString(16)}`) {
			return true;
		} else {
			notification({
				title: 'Wrong Network!',
				message: `Please select ${defaultChain.chainName} in MetaMask Wallet.`,
				dangerouslyUseHTMLString: true,
				type: 'error',
				duration: 3000,
			})
		}
	} catch(err) {
		console.log(err);
	}
	return false;
}

// SWITCH NETWORK
async function switchNetworkToDefault() {
	const defaultChain = app.config.globalProperties.defaultchain;
	const provider = getProvider();
	await provider.send("wallet_addEthereumChain", [
		{
			chainId: `0x${defaultChain.chainId.toString(16)}`,
			chainName: defaultChain.chainName,
			nativeCurrency: defaultChain.nativeCurrency,
			rpcUrls: [defaultChain.rpcUrl],
		},
	]);
	await provider.send("eth_requestAccounts", []);
	router.go();
}

// PERSONAL SIGN
async function personalSign(challenge, address, deniedMessage) {
  let loading = show_loading();
	let personalSign = null;
	try {
		if(isDefaultNetwork()) {
			const provider = getProvider();
			personalSign = await provider.send("personal_sign", [challenge, address]);
		}
	} catch (err) {
		console.log(err);
		if(err.code === 4001 && deniedMessage) {
			notification({
				// title: "OOPS!",
				message: deniedMessage,
				type: "error",
				duration: 3000,
			});
		} else if(err.code != 4001) {
			notification({
				title: "OOPS!",
				message: "Something went wrong, you might need to disconnect and reconnect your MetaMask wallet.",
				type: "error",
				duration: 3000,
			});
		}
	}
	loading.close();
	return personalSign;
}

// DISCONNECT WALLET
async function disconnectWallet() {
	try {
		const provider = getProvider();
		provider.disconnect();
	} catch (err) {
		console.log(err);
	}
	store.commit('resetConnectionStore', { is_connected: false });
	store.commit('setAccountStore', null);
	router.go();
}

function show_loading() {
  let loading = ElLoading.service({
    lock: true,
    text: '',
    background: 'rgba(0, 0, 0, 0.7)',
    fullscreen: true,
  });
  return loading;
}

export default {
	getProvider,
	setWatchers,
	getAccount,
	connectWallet,
	isDefaultNetwork,
	switchNetworkToDefault,
	personalSign,
	disconnectWallet 
};
