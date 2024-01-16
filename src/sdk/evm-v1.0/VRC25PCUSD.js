const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/VRC25PCUSD')
const contractDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/VRC25PCUSD.json`)
const contractAddress = contractDep.address
const tokenDecimal = 6

class SDK {
	constructor(_, signer) {
		this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
	}

	async balanceOf(owner) {
		let balance = await this.contract.balanceOf(owner)
		return parseInt(balance.toString()) / (10 ** tokenDecimal) || 0
	}

	async allowance(owner, spender) {
		let allowance = await this.contract.allowance(owner, spender)
		return parseInt(allowance.toString()) / (10 ** tokenDecimal) || 0
	}
	
	async approve(spender, amount) {
		const tx = await this.contract.approve(spender, amount, {
			gasLimit: 4000000
		})
		return await tx.wait()
	}
	
	async transfer(recipient, amount) {
		const tx = await this.contract.transfer(recipient, amount, {
			gasLimit: 4000000
		})
		return await tx.wait()
	}
}

module.exports = SDK
