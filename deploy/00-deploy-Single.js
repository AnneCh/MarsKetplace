const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { storeImages, storeMetadata } = require("../utils/upload-to-pinata")

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
}
const imagesLocation = "./nftImages/"

//const tokenUri = "ipfs://QmXxMKvi5UgUDggqDYSUohmhgpAyZFVa7rSveyC8poYRz1"

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  params = tokenUri

  const mintNFT = await deploy("MintOneToken", {
    from: deployer,
    args: "",
    log: true,
    waitConfirmations: network.config.waitConfirmations,
  })

  await storeImages(imagesLocation)

  log(`Contract deployed! the address of your contract is ${mintNFT.address}`)
}

async function handleTokenURI() {
  tokenUri = ""
  return tokenUri
}

module.exports.tags = ["all", "single", "main"]
