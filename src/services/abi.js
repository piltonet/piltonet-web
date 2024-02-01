// const store = require('@/store').default;
// const wallets = require('@/wallets').default;
const { ethers } = require('ethers');
const { SDK } = require('@/sdk');
const { ElLoading } = require('element-plus');
const { notification } = require('@/plugins');

class abi {
	constructor(contractAddress, contractName, connectedAccount, signer) {
		this.contractAddress = contractAddress;
		this.contractName = contractName;
		this.connectedAccount = connectedAccount;
		this.contract = new SDK[contractName](contractAddress, signer);
	}
	
	static async setAbi(contractAddress, contractName) {
		const store = require('@/store').default;
		const wallets = require('@/wallets').default;
		const connectedAccount = store.getters.getConnectionStore;
		const wallet = wallets[connectedAccount.connected_wallet];
		const provider = new ethers.BrowserProvider(wallet.getProvider() || window.ethereum);
    const signer = await provider.getSigner();
		return new abi(contractAddress, contractName, connectedAccount, signer);
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
			resp.message = 'Show Log Message.';
			resp.result = transaction;
		} catch(err) {
			resp.done = false;
			resp.message_type = 'error';
			resp.message = this.handleErrors(err, _errNotif);
		}
		if(_loading) loading.close();
		return resp;
	}

	handleErrors(err, notif = true) {
		let errTitle = 'Error';
		let errMessage = 'Make sure the address and network are correct and you have enough funds for the transaction.';
		let errType = 'error';

		if(this.connectedAccount.connected_wallet == 'metamask') {
			const error = JSON.parse(JSON.stringify(err));
			errMessage = error?.shortMessage || errMessage;
			if(error?.code && error.code == 'ACTION_REJECTED') {
				errTitle = null;
				errType = 'warning';
			} else {
				console.log(error || err);
			}
		} else {
			console.log(err);
		}

		if(notif) {
			notification({
				title: errTitle,
				message: errMessage,
				dangerouslyUseHTMLString: true,
				type: errType,
				duration: 3000,
			});
		}
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
