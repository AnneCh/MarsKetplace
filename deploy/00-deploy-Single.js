const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { storeImages, storeMetadata } = require("../utils/upload-to-pinata")

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
}
const imagesLocation = "./nftImages/"

const tokenUri = "ipfs://Qmd2PwoPnfrKdRGvBnMFcW7eRg1QGsayT1UpFBB2Wk6HjF"

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUri = await handleTokenURI()
  }

  const mintNFT = await deploy("MintOneToken", {
    from: deployer,
    args: "",
    log: true,
    waitConfirmations: network.config.waitConfirmations,
  })

  log(`Contract deployed! the address of your contract is ${mintNFT.address}`)
}

async function handleTokenURI() {
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
  let tokenUris = []
  for (responseIndex in imageUploadResponses) {
    let metadata = { ...metadataTemplate }
    metadata.name = files[responseIndex].replace(".png", "")
    metadata.description = `You now own your very own plot of land on Mars! Your NFT token is ${metadata.name}`
    metadata.image = `ipfs://${imageUploadResponses[responseIndex].IpfsHash}`
    console.log(`Uploading ${metadata.name}...`)
    const metadataUploadResponse = await storeMetadata(metadata)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
  }
  console.log("Token URIs uploaded! They are:")
  console.log(tokenUris)
  return tokenUris
}
module.exports.tags = ["all", "single", "main"]
