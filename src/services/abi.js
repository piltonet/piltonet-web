// import store from "@/store";
// const { ethers } = require('ethers')
const { SDK } = require('@/sdk')
const { ElLoading } = require('element-plus')

class abi {
	constructor(contractAddress, contractName, sdk, signer) {
		this.contractAddress = contractAddress;
		this.contractName = contractName;
		this.signer = signer;
		this.contract = new sdk(contractAddress, signer);
	}
	
	static setAbi(contractAddress, contractName, signer) {
		let sdk = SDK[contractName];
		return new abi(contractAddress, contractName, sdk, signer);
	}

	async interaction(_function, _params, _loading = true) {
		let resp = {
			origin_url: `abi/${this.contractName}/${_function}`,
			response_id: null,
			status_code: 200,
			done: true,
			message_type: null,
			message: null,
			result: null
		}

		let loading = _loading ? this.show_loading() : '';
		
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
			resp.message = "Show Log Error." +
			"<br>Make sure the address and network are correct and you have enough funds for the transaction.";
		}
		if(_loading) loading.close();
		return resp;
	}

	show_loading() {
		let loading = ElLoading.service({
			lock: true,
			text: '',
			background: 'rgba(0, 0, 0, 0.7)',
			fullscreen: true,
		});
		return loading;
	}

}

module.exports = abi
