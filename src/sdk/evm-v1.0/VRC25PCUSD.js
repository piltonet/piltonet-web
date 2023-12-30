const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/VRC25PCUSD')
const contractDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/VRC25PCUSD.json`)
const contractAddress = contractDep.address

class SDK {
	constructor(_, signer) {
		this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
	}

	balanceOf(owner) {
		return this.contract.balanceOf(owner)
	}
	
	async transfer(recipient, amount) {
		const tx = await this.contract.transfer(recipient, amount, {
			gasLimit: 4000000
		});
		return await tx.wait();
	}
}

module.exports = SDK
