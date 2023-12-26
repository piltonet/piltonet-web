const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/ERC6551Account')

const contractDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/ERC1155Contacts.json`)
const ERC1155Contacts = contractDep.address

class SDK {
	constructor(contractAddress, signer) {
		this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
	}

	owner() {
		return this.contract.owner()
	}
	
	async execute(
		to,
		value,
		data,
		operation
	) {
		const tx = await this.contract.execute(to, value, data, operation, {
			gasLimit: 4000000
		})
		return await tx.wait();
	}

	// execute to ERC1155Contacts
	async callContacts(
		method,
		abi,
		args
	) {
		let iface = new ethers.Interface(abi);
		let data = iface.encodeFunctionData(method, args);
		return await this.execute(
			ERC1155Contacts,
			0,
			data,
			0
		)
	}
}

module.exports = SDK
