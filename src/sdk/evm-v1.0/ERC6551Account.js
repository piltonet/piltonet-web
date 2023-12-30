const { ethers } = require('ethers')
const contractAbi = require('@/contracts/abi/ERC6551Account')

const VRC25PCUSDDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/VRC25PCUSD.json`)
const ERC1155ContactsDep = require(`@/contracts/deployments/${process.env.VUE_APP_DEFAULT_NETWORK}/ERC1155Contacts.json`)
const contracts = {
	"VRC25PCUSD": VRC25PCUSDDep.address,
	"ERC1155Contacts": ERC1155ContactsDep.address
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
		const tx = await this.contract.execute(to, value, data, operation, {
			gasLimit: 6000000
		})
		return await tx.wait();
	}

	// execute function in other contracts
	async executeFunction(
		contractName,
		functionName,
		functionAbi,
		functionArgs,
		value
	) {
		let iface = new ethers.Interface(functionAbi);
		let data = iface.encodeFunctionData(functionName, functionArgs);
		return await this.execute(
			contracts[contractName], // to
			value, // value
			data, // data
			0 // operation
		)
	}
}

module.exports = SDK
