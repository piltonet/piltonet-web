module.exports = [
    {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18, wrappedToken: '' },
        rpcUrl: '', blockExplorerUrl: 'https://etherscan.com',
        isSupported: false
    },
    {
        chainId: '0x38',
        chainName: 'Smart Chain',
        nativeCurrency: { name: 'Binance', symbol: 'BNB', decimals: 18, wrappedToken: '' },
        rpcUrl: '', blockExplorerUrl: '',
        isSupported: false
    },
    {
        chainId: '0xa4b1',
        chainName: 'Arbitrum',
        nativeCurrency: { name: 'Arbitrum', symbol: 'ETh', decimals: 18, wrappedToken: '' },
        rpcUrl: 'https://arb1.arbitrum.io/rpc', blockExplorerUrl: 'https://arbiscan.io',
        isSupported: false
    },
    {
        chainId: '0x58',
        chainName: 'Viction',
        nativeCurrency: { name: 'Viction', symbol: 'VIC', decimals: 18, wrappedToken: '' },
        rpcUrl: 'https://rpc.viction.xyz', blockExplorerUrl: 'https:/vicscan.xyz',
        isSupported: true
    },
    {
        chainId: '// 0x59',
        chainName: 'Viction Testnet',
        nativeCurrency: { name: 'Viction', symbol: 'VIC', decimals: 18, wrappedToken: '' },
        rpcUrl: 'https://rpc-testnet.viction.xyz', blockExplorerUrl: 'https://testnet.vicscan.xyz',
        isSupported: true,
    },
    {
        chainId: '0x59',
        chainName: 'Viction Testnet',
        nativeCurrency: { name: 'Tomo', symbol: 'TOMO', decimals: 18, wrappedToken: '' },
        rpcUrl: 'https://rpc.testnet.tomochain.com', blockExplorerUrl: 'https://testnet.tomoscan.io',
        isSupported: true,
    }
]