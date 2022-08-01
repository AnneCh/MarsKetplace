const { network } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { verify } = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  params = []

  const mintNFT = await deploy('MintNFT', {
    from: deployer,
    args: params,
    log: true,
    waitConfirmations: network.config.waitConfirmations,
  })

  //verifying contract on etherscan
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log('Verifying...')
    await verify(mintNFT.address, params)
  }
}

module.exports.tags = ['all', 'mintNFT']
