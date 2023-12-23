import app from '@/main'
import router from '@/router'
import store from "@/store"
import api from "@/services/api"
import { notification } from '@/plugins'
import { ElLoading } from 'element-plus'



import {
  configureChains,
  // createClient,
  createConfig,
  // fetchBalance,
	signMessage,
	switchNetwork,
  disconnect
} from '@wagmi/core'


/*
'@wagmi/core' (possible exports: 
	ChainMismatchError, 
	ChainNotConfiguredError, 
	Config, 
	ConfigChainsNotFound, 
	Connector, 
	ConnectorAlreadyConnectedError, 
	ConnectorNotFoundError, 
	InjectedConnector, 
	SwitchChainNotSupportedError, 
	configureChains, 
	connect, 
	createConfig, 
	createStorage, 
	deepEqual, 
	deserialize, 
	disconnect, 
	erc20ABI, 
	erc4626ABI, 
	erc721ABI, 
	fetchBalance, 
	fetchBlockNumber, 
	fetchEnsAddress, 
	fetchEnsAvatar, 
	fetchEnsName, fetchEnsResolver, fetchFeeData, fetchToken, fetchTransaction, getAccount, getConfig, getContract, getNetwork, getPublicClient, getUnit, getWalletClient, getWebSocketPublicClient, mainnet, multicall, noopStorage, prepareSendTransaction, prepareWriteContract, readContract, readContracts, sendTransaction, sepolia, serialize, signMessage, signTypedData, switchNetwork, waitForTransaction, watchAccount, watchBlockNumber, watchContractEvent, watchMulticall, watchNetwork, watchPendingTransactions, watchPublicClient, watchReadContract, watchReadContracts, watchWalletClient, watchWebSocketPublicClient, writeContract)
*/



// import {
// 	goerli,
//   mainnet,
//   bsc,
//   bscTestnet,
//   polygon,
//   polygonMumbai,
//   avalanche,
//   avalancheFuji
// } from '@wagmi/core/chains'
import { publicProvider } from '@wagmi/core/providers/public'
import {
  EthereumClient,
  // modalConnectors,
  w3mConnectors,
  // walletConnectProvider
} from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'

const projectId = process.env.VUE_APP_WALLETCONNECT_PROJECTID;
// const infuraKey = process.env.VUE_APP_INFURA_KEY
// const chains = [
// 	mainnet,
// 	goerli,
// 	bsc,
// 	bscTestnet,
// 	avalanche,
// 	avalancheFuji,
// 	polygonMumbai,
// 	polygon
// ]

import chains from "@/configs/chains.js";
const walletConnectChains = [chains[process.env.VUE_APP_DEFAULT_NETWORK]];



let { provider, webSocketProvider } = configureChains(walletConnectChains, [publicProvider()])

const wagmiClient = createConfig({
	autoConnect: true,
	// connectors: [...modalConnectors({ appName: 'TEZUKA NFT', walletConnectChains })],
	connectors: w3mConnectors({ projectId, walletConnectChains }),
	provider,
	webSocketProvider
})


// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, walletConnectChains }),
//   publicClient
// })

const ethereumClient = new EthereumClient(wagmiClient, walletConnectChains)
const web3modal = new Web3Modal(
	{
		projectId,
		defaultChain: walletConnectChains[0],
		themeMode: 'light',
		themeColor: 'blue',
		themeBackground: 'gradient'
	},
	ethereumClient
)

import { ethers } from 'ethers'
import { ContractFactory } from 'ethers';





// web3modal.subscribeModal((newState) => {
// 	console.log('subscribeModal', newState);
// });
web3modal.subscribeEvents(async (newState) => {
	const { name } = newState;
	if(name === "ACCOUNT_CONNECTED") {
		await accountConnected([ethereumClient.getAccount().address.toLowerCase()]);
		setWatchers();
	}

	if(name === "ACCOUNT_DISCONNECTED") {
		console.log('ACCOUNT_DISCONNECTED');
		let connection = store.getters.getConnectionStore;
		if(connection && connection.is_connected) {
			store.commit('resetConnectionStore', { is_connected: false });
			store.commit('setAccountStore', null);
			router.go();
		}
	}
});

// GET PROVIDER
function getProvider() {
	try {
		console.log(ethereumClient.getConnectors());
		console.log(ethereumClient.getNetwork());
		console.log(ethereumClient.getNetwork().chain);
		if(ethereumClient.getConnectors() && ethereumClient.getConnectors().length > 0) {
			return ethereumClient.getConnectors()[0].options.getProvider();
		} else if(ethereumClient) {
			const chainId = ethereumClient.getNetwork()?.chain?.id || 0;
			return {...ethereumClient, chainId: `0x${chainId.toString(16)}`};
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
		web3modal.openModal();
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
	ethereumClient.watchAccount(async (walletAccount) => {
		if(walletAccount.isConnected) {
			let connection = store.getters.getConnectionStore;
			if(connection && connection.is_connected) {
				if(walletAccount.address?.toLowerCase() !== connection.selectedAddress?.toLowerCase()) {
					await accountConnected([walletAccount.address?.toLowerCase()]);
					router.go();
				}
			} else {
				await disconnectWallet();
			}
		}
	});
	// ethereumClient.watchNetwork((network) => {
	// 	console.log('network', network);
	// });
}

// GET ACCOUNT
async function accountConnected(walletAccounts) {
	const notification = app.config.globalProperties.notif;
	if(walletAccounts.length > 0) {
		const currentAccount = walletAccounts[0];
		// Send to Server via API
		let apiResponse = await api.post_account_connect({ account_address: currentAccount });
		if(apiResponse.data.done) {
			store.commit('setConnectionStore', {
				is_connected: true,
				connectedWallet: 'walletconnect',
				selectedAddress: currentAccount,
				accessToken: apiResponse.data.result[0].accessToken,
				expirationDate: apiResponse.data.result[0].expirationDate
			});
			store.commit('setAccountStore', apiResponse.data.result[0]);
			notification({
				title: "SUCCESS!",
				message:
					"You have successfully connected." +
					`<br>Account: ${app.config.globalProperties.utils.truncate(currentAccount, 12)}`,
				dangerouslyUseHTMLString: true,
				type: "success",
				duration: 3000,
				// onClose: () => { router.go() }
			});
			return true;
		} else {
			// store.commit('resetConnectionStore', { is_connected: false });
			// store.commit('setAccountStore', null);
			notification({
				title: "SERVER ERROR!",
				message: apiResponse.data.message,
				type: apiResponse.data.message_type,
				duration: 3000,
				// onClose: () => { router.go() }
			});
			return false;
		}
	} else {
		store.commit('resetConnectionStore', { is_connected: false });
		store.commit('setAccountStore', null);
		notification({
			title: "NO ACCOUNT DETECTED!",
			message:
				"No accounts were found connected to your wallet.",
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
		const chainId = `0x${(ethereumClient.getNetwork()?.chain?.id || 0).toString(16)}`;
		console.log(chainId);
		const defaultChain = app.config.globalProperties.defaultchain;
		console.log(defaultChain);
		if(chainId === defaultChain.chainId) {
			return true;
		} else {
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
async function switchNetworkToDefault() {
	let loading = show_loading();
	try {
		const defaultChain = app.config.globalProperties.defaultchain;
		switchNetwork({chainId: defaultChain.chainId});
		loading.close();
		return true;
	} catch(err) {
		console.log(err);
		loading.close();
		return false;
	}
	// await provider.send("eth_requestAccounts", []);
	// router.go();
}

// async function switchNetworkToDefault(provider = undefined) {
// 	let loading = show_loading();
// 	provider = provider || getProvider();
// 	const defaultChain = app.config.globalProperties.defaultchain;

// 	try {
// 		await provider.request({
// 			method: 'wallet_switchEthereumChain',
// 			params: [{ chainId: defaultChain.chainId }],
// 		});
// 	} catch(err) {
// 		if(err.code === 4902 || err.data?.originalError?.code === 4902) {
// 			try {
// 				await provider.request({
// 					method: 'wallet_addEthereumChain',
// 					params: [defaultChain],
// 				});
// 			} catch(err) {
// 				console.log(err);
// 			}
// 		} else {
// 			console.log(err);
// 		}
// 	} finally {
// 		loading.close();
// 	}
// }

// PERSONAL SIGN
async function personalSign(challenge, address, deniedMessage) {
  let loading = show_loading();
	let personalSign = null;
	try {
		if(ethereumClient.getAccount().address.toLowerCase() === address.toLowerCase() && isDefaultNetwork(getProvider())) {
			personalSign = await signMessage({message: challenge});
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
		store.commit('resetConnectionStore', { is_connected: false });
		store.commit('setAccountStore', null);
		await disconnect();
	} catch(err) {
		console.log(err);
	} finally {
		router.go();
	}
}

// Deploy Custom Contract
async function deployCustomContract(contractInfo) {
  let loading = show_loading();
  
  try {
    if(!isDefaultNetwork(getProvider())) {
      loading.close();
      return
    }
    const provider = new ethers.BrowserProvider(getProvider());
    const signer = await provider.getSigner();
    const contracts = require(`@/contracts`);
    const contractJsonFile =  contracts[process.env.VUE_APP_CUSTOM_CONTRACT_ABI];
    const contractJson = JSON.parse(JSON.stringify(contractJsonFile));
    const contractAbi = contractJson.abi;
    const contractByteCode = contractJson.bytecode;
  
    const launchpadAdr = process.env.VUE_APP_MACRO_CONTRACT_OWNER;
    const launchpadShare = process.env.VUE_APP_CUSTOM_CONTRACT_LAUNCHPADSHARE * 10000;

    const factory = new ContractFactory(contractAbi, contractByteCode, signer);
    const nftContract = await factory.deploy(
      contractInfo.contract_name,
      contractInfo.contract_symbol,
      contractInfo.contract_mint_token,
      Math.round(contractInfo.contract_mint_price * 10**2),
      contractInfo.contract_max_supply,
      contractInfo.contract_max_mint,
      launchpadAdr,
      launchpadShare
    );
  
    // await nftContract.deployed();
    nftContract['contract_abi'] = process.env.VUE_APP_CUSTOM_CONTRACT_ABI;
    loading.close();
    return nftContract;
  } catch(err) {
    console.log(err);
    loading.close();
    return null;
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
	disconnectWallet,
	deployCustomContract
};
