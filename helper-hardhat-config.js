const networkConfig = {
  1337: {
    name: 'localhost',
    //ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc', // 30 gwei
    mintFee: '1000000000000000000', // 1 ETH
    callbackGasLimit: '500000', // 500,000 gas
    subscriptionId: '8197', // our own ID
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  4: {
    name: 'rinkeby',
    //ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    vrfCoordinatorV2: '0x6168499c0cFfCaCD319c818142124B7A15E857ab',
    gasLane:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    callbackGasLimit: '500000', // 500,000 gas
    mintFee: '100000000000000000', // 0.1 ETH
    subscriptionId: '8197', // our own ID
  },
}

const developmentChains = ['hardhat', 'localhost']

module.exports = {
  networkConfig,
  developmentChains,
}
