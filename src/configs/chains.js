module.exports = {
	viction_mainnet: {
		id: 88,
		chainId: '0x58',
		name: 'Viction',
		network: 'tomochain',
		nativeCurrency: {
			decimals: 18,
			name: 'Viction',
			symbol: 'VIC'
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.tomochain.com/'],
				// webSocket: ['wss://bsc-ws-node.nariox.org:443']
			},
			public: {
				http: ['https://rpc.tomochain.com/'],
				// webSocket: ['wss://bsc-ws-node.nariox.org:443']
			},
		},
		blockExplorers: {
			etherscan: {
				name: 'TomoScan',
				url: 'https://tomoscan.io/',
			},
			default: {
				name: 'TomoScan',
				url: 'https://tomoscan.io/',
			},
		},
		contracts: {
			// multicall3: {
			// 	address: '0xca11bde05977b3631167028862be2a173976ca11',
			// 	blockCreated: 15921452,
			// },
		},
		
		// rpcUrls: ['https://rpc.tomochain.com/'], blockExplorerUrls: ['https://tomoscan.io/'],
		
		isSupported: true,
		logoURI: 'https://cryptologos.cc/logos/tomochain-tomo-logo.png?v=025'
	},
	viction_testnet: {
		id: 89,
		chainId: '0x59',
		name: 'Viction Testnet',
		network: 'tomochain_testnet',
		nativeCurrency: {
			decimals: 18,
			name: 'Viction',
			symbol: 'VIC'
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.testnet.tomochain.com/'],
				// webSocket: ['wss://bsc-ws-node.nariox.org:443']
			},
			public: {
				http: ['https://rpc.testnet.tomochain.com/'],
				// webSocket: ['wss://bsc-ws-node.nariox.org:443']
			},
		},
		blockExplorers: {
			etherscan: {
				name: 'TomoScan',
				url: 'https://testnet.tomoscan.io/',
			},
			default: {
				name: 'TomoScan',
				url: 'https://testnet.tomoscan.io/',
			},
		},
		contracts: {
			// multicall3: {
			// 	address: '0xca11bde05977b3631167028862be2a173976ca11',
			// 	blockCreated: 15921452,
			// },
		},
		
		// rpcUrls: ['https://rpc.tomochain.com/'], blockExplorerUrls: ['https://tomoscan.io/'],
		
		isSupported: true,
		logoURI: 'https://cryptologos.cc/logos/tomochain-tomo-logo.png?v=025'
	}
}