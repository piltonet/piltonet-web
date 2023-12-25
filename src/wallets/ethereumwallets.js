import app from '@/main'
import router from '@/router'
import store from "@/store"
import api from "@/services/api"
import { notification } from '@/plugins'
import { ElLoading } from 'element-plus'

// GET PROVIDER
function getProvider(walletName = undefined) {
	if(!walletName) {
		let connectedAccount = store.getters.getConnectionStore;
		if(connectedAccount && connectedAccount.is_connected && connectedAccount.connected_wallet) {
			walletName = connectedAccount.connected_wallet;
		} else {
			walletName = 'metamask';
		}
	}
	switch(walletName) {
		case 'metamask':
			return getMetamaskProvider();

		case 'coin98':
			return getCoin98Provider();

		case 'coinbase':
			return getCoinbaseProvider();
	}
}

// GET METAMASK PROVIDER
function getMetamaskProvider() {
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

// GET COIN98 PROVIDER
function getCoin98Provider() {
	try {
		if(window.coin98) return window.coin98.provider;
		if(window.ethereum?.providers) {
			const coin98Provider = window.ethereum.providers.find((provider) => provider.isCoin98);
			if(coin98Provider) return coin98Provider;
		} 
		if(window.ethereum?.isCoin98) return window.ethereum;

		if(app.config.globalProperties.device.type.mobile) {
			notification({
				title: "Mobile App",
				message:
					'First of all, you have to install the <a href="https://coin98.io/" target="_blank" class="text-decoration-underline">Coin98 mobile app</a>.' +
					"<br> Then you can use Coin98 mobile app browser!",
				dangerouslyUseHTMLString: true,
				type: "warning",
				duration: 5000,
			});
		} else {
			notification({
				title: "Coin98 Not Found",
				message:
					'First of all, you have to visit the <a href="https://coin98.com/" target="_blank" class="text-decoration-underline">Coin98 website</a> and install the Coin98 wallet.',
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

// GET COINBASE PROVIDER
function getCoinbaseProvider() {
	try {
		// if(window.CoinbaseWalletProvider) return window.CoinbaseWalletProvider;
		if(window.ethereum?.providers) {
			const coinbaseProvider = window.ethereum.providers.find((provider) => provider.isCoinbaseWallet);
			if(coinbaseProvider) return coinbaseProvider;
		}
		if(window.ethereum?.isCoinbaseWallet) {
			return window.ethereum;
		}

		if(app.config.globalProperties.device.type.mobile) {
			notification({
				title: "Mobile App",
				message:
					'First of all, you have to install the <a href="https://www.coinbase.com/wallet" target="_blank" class="text-decoration-underline">Coinbase mobile app</a>.' +
					"<br> Then you can use Coinbase mobile app browser!",
				dangerouslyUseHTMLString: true,
				type: "warning",
				duration: 5000,
			});
		} else {
			notification({
				title: "MetaMask Not Found",
				message:
					'First of all, you have to visit the <a href="https://www.coinbase.com/wallet" target="_blank" class="text-decoration-underline">Coinbase website</a>.' +
					"<br> Click on the “Download” option to install the Coinbase wallet.",
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
async function connectWallet(walletName) {
  let loading = show_loading();
	try {
		let provider = getProvider(walletName);
		if(provider) {
			if(isDefaultNetwork(provider)) {
				const walletAccounts = await provider.request({ method: "eth_requestAccounts" });
				let accountExists = await getAccount(walletName, walletAccounts);
				if(accountExists) setWatchers(walletName);
				loading.close();
				return accountExists;
			} else {
				await switchNetworkToDefault(provider);
			}
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
function setWatchers(walletName) {
	getProvider(walletName).on('accountsChanged', async (walletAccounts) => {
		let connectedAccount = store.getters.getConnectionStore;
		if(connectedAccount && connectedAccount.is_connected && walletAccounts.length > 0 && walletAccounts[0] != connectedAccount.account_address) {
			await getAccount(connectedAccount.connected_wallet, walletAccounts);
			router.go();
		} else {
			await disconnectWallet();
		}
	});

	// getProvider(walletName).on('chainChanged', async () => {
	// 	let connection = store.getters.getConnectionStore;
	// 	if(connection && connection.is_connected) {
	// 		await disconnectWallet();
	// 	}
	// });
}

// GET ACCOUNT
async function getAccount(walletName, metamaskAccounts) {
	const notification = app.config.globalProperties.notif;
	if(metamaskAccounts.length > 0) {
		// Send to Server via API
		let apiResponse = await api.post_account_connect({ account_address: metamaskAccounts[0] });
		if(apiResponse.data.done) {
			const connectedAccount = apiResponse.data.result[0];
			store.commit('setConnectionStore', {
				is_connected: true,
				connected_wallet: walletName,
				account_address: connectedAccount.account_address,
				account_status: connectedAccount.account_status,
				main_account_address: connectedAccount.main_account_address,
				access_token: connectedAccount.access_token,
				last_connect: connectedAccount.last_connect,
				expiration_date: connectedAccount.expiration_date
			});
			if(connectedAccount.account_status === 'fresh' || connectedAccount.account_status === 'waiting') {
				router.push("/account");
				return true;
			} else {
				store.dispatch('fetchProfile');
				notification({
					title: "SUCCESS!",
					message:
						"You have successfully connected with MetaMask wallet." +
						`<br>Account: ${app.config.globalProperties.utils.truncate(connectedAccount.account_address, 12)}`,
					dangerouslyUseHTMLString: true,
					type: "success",
					duration: 3000,
					onClose: () => { /* router.push("/account/profile") */ }
				});
				return true;
			}
		} else {
			store.commit('setConnectionStore', {is_connected: false});
			store.commit('setProfileStore', null);
			router.push("/");
			notification({
				title: "Server apiResponse!",
				message: apiResponse.data.message,
				type: apiResponse.data.message_type,
				duration: 5000,
			});
			return false;
		}
	} else {
		store.commit('setConnectionStore', {is_connected: false});
		store.commit('setProfileStore', null);
		notification({
			title: "No MetaMask Account Detected!",
			message:
				"No accounts were found connected to your MetaMask wallet.",
			dangerouslyUseHTMLString: true,
			type: "error",
			duration: 3000,
		});
		return true;
	}
}

// IS DAFAULT NETWORK
function isDefaultNetwork(provider = undefined, notif = true) {
	try {
		if(!provider) {
			let walletName = store.getters.getConnectionStore?.connected_wallet;
			provider = getProvider(walletName);
		}
		const defaultChain = app.config.globalProperties.defaultchain;
		if(provider.chainId === defaultChain.chainId) {
			return true;
		} else if(notif) {
			notification({
				title: 'Wrong Network!',
				message: `Please select ${defaultChain.chainName} in the wallet.`,
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
async function switchNetworkToDefault(provider = undefined) {
	let loading = show_loading();
	let walletName = store.getters.getConnectionStore?.connected_wallet;
	provider = provider || getProvider(walletName);
	const defaultChain = app.config.globalProperties.defaultchain;

	try {
		await provider.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: defaultChain.chainId }],
		});
	} catch(err) {
		if(err.code === 4902) {
			try {
				await provider.request({
					method: 'wallet_addEthereumChain',
					params: [defaultChain],
				});
			} catch(err) {
				console.log(err);
			}
		} else {
			console.log(err);
		}
	} finally {
		loading.close();
	}
}

// PERSONAL SIGN
async function personalSign(challenge, address, deniedMessage) {
  let loading = show_loading();
	let personalSign = null;
	try {
		let walletName = store.getters.getConnectionStore?.connected_wallet;
		const provider = getProvider(walletName);
		if(isDefaultNetwork(provider)) {
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
				message: "Something went wrong, you might need to disconnect and reconnect your wallet.",
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
		let walletName = store.getters.getConnectionStore?.connected_wallet;
		const provider = getProvider(walletName);
		provider.disconnect();
	} catch (err) {
		console.log(err);
	} finally {
		await store.dispatch('logoutAccount');
		router.go();
	}
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
	connectWallet,
	isDefaultNetwork,
	switchNetworkToDefault,
	personalSign,
	disconnectWallet
};
