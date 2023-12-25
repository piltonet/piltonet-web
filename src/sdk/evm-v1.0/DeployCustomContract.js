const { ContractFactory } = require('ethers')
const TLCCAbi = require('@/contracts/abi/ERC1155Contacts')
const TLCCByteCode = require('@/contracts/byteCode/ERC1155Contacts')

class SDK {
	constructor(contractAddress, signer) {
		this.contractAddress = contractAddress
		this.signer = signer
	}

	async deployTLCC(
		deployArgs
	) {
		console.log(deployArgs);
		const factory = this.contractAddress == '0x' ?
			new ContractFactory(TLCCAbi, TLCCByteCode, this.signer) :
			new ContractFactory(TLCCAbi, TLCCByteCode, this.signer, this.contractAddress)
    return await factory.deploy(deployArgs, {
			gasLimit: 4000000
		})
	}
}

module.exports = SDK
