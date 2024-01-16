const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/ERC6551Account')

const VRC25PCUSDDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/VRC25PCUSD.json`)
const ContactListDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/ContactList.json`)
const contracts = {
	"VRC25PCUSD": VRC25PCUSDDep.address,
	"ContactList": ContactListDep.address
}

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
		const _to = ethers.getAddress(to)
		const _value = ethers.parseEther(value.toString())
		const tx = await this.contract.execute(_to, _value, data, operation, {
			gasLimit: 300000
		})
		return await tx.wait()
	}
	
	// transfer VIC
	async transferVIC(
		address,
		amount
	) {
		const to = ethers.getAddress(address)
		const value = ethers.parseEther(amount.toString())
		const tx = await this.contract.execute(to, value, "0x", 0, {
			gasLimit: 300000
		})
		return await tx.wait()
	}

	// transfer CUSD
	async transferCUSD(
		address,
		amount
	) {
		const contractName = "VRC25PCUSD"
		const functionName = "transfer"
		const functionAbi = "function transfer(address recipient, uint256 amount)"
		const functionArgs = [ethers.getAddress(address), ethers.toBigInt(parseFloat(amount) * 1e6)]
		let iface = new ethers.Interface(functionAbi)
		let data = iface.encodeFunctionData(functionName, functionArgs)
		return await this.execute(
			contracts[contractName], // to
			0, // value
			data, // data
			0 // operation
		)
	}

	// execute function in other contracts
	async executeFunction(
		contractName,
		functionName,
		functionAbi,
		functionArgs,
		amount,
		contractAddress = undefined
	) {
		let iface = new ethers.Interface(functionAbi)
		let data = iface.encodeFunctionData(functionName, functionArgs)
		const value = ethers.parseEther(amount.toString())
		const to =  contractAddress ? ethers.getAddress(contractAddress) : contracts[contractName];
		return await this.execute(
			to,
			value,
			data,
			0 // operation
		)
	}
}

module.exports = SDK
