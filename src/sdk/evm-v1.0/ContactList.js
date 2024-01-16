const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/ContactList')
const contractDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/ContactList.json`)
const contractAddress = contractDep.address

class SDK {
	constructor(_, signer) {
		this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
	}

	owner() {
		return this.contract.owner();
	}
	
	totalSupply() {
		return this.contract.totalSupply();
	}
	
	balanceOf(account, id) {
		return this.contract.balanceOf(account, id);
	}

}

module.exports = SDK
