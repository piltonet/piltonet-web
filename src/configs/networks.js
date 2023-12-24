module.exports = [
    {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18, wrappedToken: '' },
        rpcUrls: [''], blockExplorerUrls: ['https://etherscan.com'],
        isSupported: false
    },
    {
        chainId: '0x38',
        chainName: 'Smart Chain',
        nativeCurrency: { name: 'Binance', symbol: 'BNB', decimals: 18, wrappedToken: '' },
        rpcUrls: [''], blockExplorerUrls: [''],
        isSupported: false
    },
    {
        chainId: '0xa4b1',
        chainName: 'Arbitrum',
        nativeCurrency: { name: 'Arbitrum', symbol: 'ETh', decimals: 18, wrappedToken: '' },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'], blockExplorerUrls: ['https://arbiscan.io/'],
        isSupported: false
    },
    {
        chainId: '0x58',
        chainName: 'Viction',
        nativeCurrency: { name: 'Viction', symbol: 'VIC', decimals: 18, wrappedToken: '' },
        rpcUrls: ['https://rpc.viction.xyz'], blockExplorerUrls: ['https:/vicscan.xyz'],
        isSupported: true
    },
    {
        chainId: '0x59',
        chainName: 'Viction Testnet',
        nativeCurrency: { name: 'Viction', symbol: 'VIC', decimals: 18, wrappedToken: '' },
        rpcUrls: ['https://rpc.testnet.tomochain.com/'], blockExplorerUrls: ['https://scan.testnet.tomochain.com/'],
        isSupported: true,
    }
]