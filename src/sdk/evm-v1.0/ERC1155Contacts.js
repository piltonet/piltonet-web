const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/ERC1155Contacts')
const contractDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/ERC1155Contacts.json`)
const contractAddress = contractDep.address

class SDK {
	constructor(_, signer) {
		this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
	}

	owner() {
		return this.contract.owner()
	}
	
	totalSupply() {
		return this.contract.totalSupply()
	}

	async addContact(
		senderTBA,
		contactTBA
	) {
		const tx = await this.contract.addContact(senderTBA, contactTBA, {
			gasLimit: 6000000
		})
		return await tx.wait();
	}
}

module.exports = SDK
