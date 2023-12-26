const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/ERC6551Account')

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
}

module.exports = SDK
