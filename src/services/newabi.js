const store = require('@/store').default;
const wallets = require('@/wallets').default;
const { ethers } = require('ethers');
const { SDK } = require('@/sdk');
const { ElLoading } = require('element-plus');
const { notification } = require("@/plugins");

class abi {
	constructor(contractAddress, contractName, signer) {
		this.contractAddress = contractAddress;
		this.contractName = contractName;
		const sdk = SDK[this.contractName];
		this.contract = new sdk(this.contractAddress, signer);
	}
	
	static async setAbi(contractAddress, contractName) {
		console.log(contractAddress);
		const connectedAccount = store.getters.getConnectionStore;
		const wallet = wallets[connectedAccount.connected_wallet];
		const provider = new ethers.BrowserProvider(wallet.getProvider() || window.ethereum);
		const signer = await provider.getSigner();
		return new abi(contractAddress, contractName, signer);
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
