const { ContractFactory } = require('ethers')
const TLCC = require('@/contracts/abi/TLCC')
const TLCCByteCode = require('@/contracts/bytecode/TLCC')

class SDK {
	constructor(contractAddress, signer) {
		this.contractAddress = contractAddress
		this.signer = signer
	}

	async deployTLCC(
		deployArgs
	) {
		const factory = new ContractFactory(TLCC, TLCCByteCode, this.signer)
    return await factory.deploy(...deployArgs, {
			gasLimit: 6000000
		})
	}
}

module.exports = SDK
