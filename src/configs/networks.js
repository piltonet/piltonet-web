module.exports = [
    {
        chainId: '0x38',
        chainName: 'Smart Chain',
        nativeCurrency: { name: 'Binance', symbol: 'BNB', decimals: 18, wrappedToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' },
        // rpcUrls: ['https://bsc-dataseed.binance.org/'], blockExplorerUrls: ['https://bscscan.com'],
        rpcUrls: ['https://summer-damp-mountain.bsc.quiknode.pro/2e0b2585ff601a7c5a6a214c42ae7c27054a8773/'],
        blockExplorerUrls: ['https://bscscan.com'],
        isSupported: false,
        logoURI: 'https://github.com/bazarion/assets/raw/main/chains/binancesmartchain/logo.png'
    },
    {
        chainId: '0x7a',
        chainName: 'Fuse Network',
        nativeCurrency: { name: 'Fuse Network', symbol: 'FUSE', decimals: 18, wrappedToken: '0x0BE9e53fd7EDaC9F859882AfdDa116645287C629' },
        rpcUrls: ['https://rpc.fuse.io'], blockExplorerUrls: ['https://explorer.fuse.io/'],
        isSupported: false,
        logoURI: 'https://github.com/bazarion/assets/raw/main/chains/fuse/logo.png'
    },
    {
        chainId: '0xa4ec',
        chainName: 'Celo',
        nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18, wrappedToken: '0x2999B189A6b06081c58bC4dA898C38089C4ad13A' },
        rpcUrls: ['https://forno.celo.org'], blockExplorerUrls: ['https://explorer.celo.org/'],
        isSupported: false,
        logoURI: 'https://raw.githubusercontent.com/bazarion/assets/main/chains/celo/logo.png'
    },
    {
        chainId: '0xa4b1',
        chainName: 'Arbitrum',
        nativeCurrency: { name: 'Arbitrum', symbol: 'ETh', decimals: 18, wrappedToken: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' },
        rpcUrls: ['https://arb1.arbitrum.io/rpc'], blockExplorerUrls: ['https://arbiscan.io/'],
        isSupported: false
    },
    {
        chainId: '0x58',
        chainName: 'Viction',
        nativeCurrency: { name: 'Viction', symbol: 'VIC', decimals: 18, wrappedToken: '0xB1f66997A5760428D3a87D68b90BfE0aE64121cC' },
        rpcUrls: ['https://rpc.tomochain.com/'], blockExplorerUrls: ['https://tomoscan.io/'],
        isSupported: true,
        logoURI: 'https://github.com/bazarion/assets/raw/main/chains/tomochain/logo.png'
    },
    {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18, wrappedToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
        rpcUrls: ['https://mainnet.infura.io/v3/bac334ea5f13410e8920d80ab2b5acd5'], blockExplorerUrls: ['https://etherscan.com'],
        isSupported: false
    },
    {
        chainId: '0x59',
        chainName: 'Viction Testnet',
        nativeCurrency: { name: 'Viction', symbol: 'VIC', decimals: 18, wrappedToken: '0x0f79657e61fe20f0bF4015C427705A57D9ae5EDc' },
        rpcUrls: ['https://rpc.testnet.tomochain.com/'], blockExplorerUrls: ['https://scan.testnet.tomochain.com/'],
        isSupported: true,
    },
    {
        chainId: '0xaef3',
        chainName: 'Alfajores Testnet',
        nativeCurrency: { name: "Alfajores Celo", symbol: 'A-CELO', decimals: 18, wrappedToken: '0x9667b35D7ed67A1a5f51F3276B90223e43c183Be' },
        rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
        blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org'],
        iconUrls: ['future'],
        isSupported: false
    },
    {
        chainId: '0x61',
        chainName: 'BSC Testnet',
        nativeCurrency: { name: "BSC Testnet", symbol: 'BNB', decimals: 18, wrappedToken: '0x5B3E2Bc1da86ff6235D9eAd4504d598caE77DBCB' },
        rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
        blockExplorerUrls: ['https://testnet.bscscan.com'],
        iconUrls: ['future'],
        isSupported: true
    }
]