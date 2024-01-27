// const store = require('@/store').default;
// const wallets = require('@/wallets').default;
const { ethers } = require('ethers');
const { SDK } = require('@/sdk');
const { ElLoading } = require('element-plus');
const { notification } = require("@/plugins");

class abi {
	constructor(contractAddress, contractName, signer) {
		this.contractAddress = contractAddress;
		this.contractName = contractName;
		this.contract = new SDK[contractName](contractAddress, signer);
	}
	
	static async setAbi(contractAddress, contractName) {
		const store = require('@/store').default;
		const wallets = require('@/wallets').default;
		const connectedAccount = store.getters.getConnectionStore;
		const wallet = wallets[connectedAccount.connected_wallet];
		const provider = new ethers.BrowserProvider(wallet.getProvider() || window.ethereum);
    const signer = await provider.getSigner();
		return new abi(contractAddress, contractName, signer);
	}

	// PERSONAL SIGN
	static async personalSign(challenge, address, deniedMessage) {
		// let loading = this.showLoading();
		let personalSign = null;
		try {
			const store = require('@/store').default;
			const wallets = require('@/wallets').default;
			const connectedAccount = store.getters.getConnectionStore;
			const wallet = wallets[connectedAccount.connected_wallet];
			const provider = new ethers.BrowserProvider(wallet.getProvider() || window.ethereum);
			personalSign = await provider.send("personal_sign", [challenge, address]);
		} catch (err) {
			console.log(err);
			if(err.code == 4001 && deniedMessage) {
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
		// loading.close();
		return personalSign;
	}

	async interaction(_function, _params, _loading = true, _errNotif = true) {
		let resp = {
			origin_url: `abi/${this.contractName}/${_function}`,
			response_id: null,
			status_code: 200,
			done: true,
			message_type: null,
			message: null,
			result: null
		}

		let loading = _loading ? this.showLoading() : '';
		
		try {
			var transaction = await this.contract[_function](..._params);
			
			resp.done = true;
			resp.message_type = 'success';
			resp.message = "Show Log Message.";
			resp.result = transaction;
		} catch(err) {
			console.log(err);
			resp.done = false;
			resp.message_type = 'error';
			resp.message = "Make sure the address and network are correct and you have enough funds for the transaction.";
			if(_errNotif) {
				notification({
					title: "OOPS!",
					message: resp.message,
					dangerouslyUseHTMLString: true,
					type: resp.message_type,
					duration: 3000,
				});
			}
		}
		if(_loading) loading.close();
		return resp;
	}

	showLoading() {
		let loading = ElLoading.service({
			lock: true,
			text: '',
			background: 'rgba(0, 0, 0, 0.7)',
			fullscreen: true,
			customClass: 'el-top-layer'
		});
		return loading;
	}

}

module.exports = abi
