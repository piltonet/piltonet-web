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
    const tx = await factory.deploy(...deployArgs)
		return await tx.waitForDeployment()
	}
}

module.exports = SDK
