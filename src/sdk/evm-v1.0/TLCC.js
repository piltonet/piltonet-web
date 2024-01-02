const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/TLCC')

class SDK {
	constructor(contractAddress, signer) {
		this.contract = new ethers.Contract(contractAddress, contractAbi, signer)
	}

	owner() {
		return this.contract.owner()
	}

	paymentToken() {
		return this.contract.paymentToken()
	}

	startDate() {
		return this.contract.startDate()
	}

	getCircleDetails() {
		return this.contract.getCircleDetails()
	}
	
	getCircleStatus() {
		return this.contract.getCircleStatus()
	}

	getWhitelist(addr) {
		return this.contract.getWhitelist(addr)
	}
	
	getMember(addr) {
		return this.contract.getMember(addr)
	}

	async setupCircle(
		circle_name,
		fixed_amount_x100,
		min_members,
		max_members,
		winners_order,
		winners_number,
		patience_benefit_x10000
	) {
		const tx = await this.contract.setupCircle(
			circle_name,
			fixed_amount_x100,
			min_members,
			max_members,
			winners_order,
			winners_number,
			patience_benefit_x10000
		, {
			gasLimit: 6000000
		})
		return await tx.wait();
	}

	async launchCircle(start_date) {
		return await this.contract.launchCircle(start_date, {
			gasLimit: 6000000
		})
	}
	
	async addToWhitelist(invited_adrs) {
		console.log(invited_adrs);
		return await this.contract.addInvites(JSON.parse(invited_adrs), {
			gasLimit: 6000000
		})
	}
	
	async removeFromWhitelist(invited_adrs) {
		return await this.contract.removeFromWhitelist(JSON.parse(invited_adrs, {
			gasLimit: 6000000
		}))
	}
}

module.exports = SDK
