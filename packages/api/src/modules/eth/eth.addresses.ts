// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-magic-numbers */

// maps a given chainId and contract name to address in checksum format
export const EVM_ADDRESS = {
  1: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  },
  5: {
    USDC: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  },

  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  80001: {
    USDC: '0x0fa8781a83e46826621b3bc094ea2a0212e71b23',
  },

  43114: {
    USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
  },
  43113: {
    USDC: '0x5425890298aed601595a70ab815c96711a31bc65',
  },
}

// Running list of EVM comptable chains with chainId
export enum EVM_CHAINID {
  // Ethereum
  ETH_MAINNET = 1,
  ROPSTEN_TESTNET = 3,
  RINKEBY_TESTNET = 5,
  GOERLI_TESTNET = 5,
  KOVAN_TESTNET = 42,

  // POLYGON
  POLYGON_MAINNET = 137,
  MUMBAI_TESTNET = 80001,

  // AVAX
  AVAX_MAINNET = 43114,
  FUJI_TESTNET = 43113,

  // METIS
  METIS_ADROMEDA_MAINNET = 1088,
  METIS_STARDUST_TESTNET = 588,

  // AURORA
  AURORA_MAINNET = 1313161554,
  AURORA_TESTNET = 1313161555,

  // BSC
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,

  // FANTOM
  FANTOM_MAINNET = 250,
  FANTOM_TESTNET = 4002,
}
