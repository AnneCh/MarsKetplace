const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { storeImages, storeMetadata } = require("../utils/upload-to-pinata")

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
}
const imagesLocation = "./nftImages/"

let tokenUri = "ipfs://QmTC3qoTfbdoY3YvypwFSq6WcDkpE5CKJekGUnNBmPonME"

let tokenUris = [
  "ipfs://QmTC3qoTfbdoY3YvypwFSq6WcDkpE5CKJekGUnNBmPonME",
  "ipfs://QmZ9GBhGK2xDrfbiVsmbJS6omvMfjRA8DcAhkAVAoUJEbS",
  "ipfs://QmVY7RPzZLnNFZDvVWAN6q5L8jBxS1o4aPYMnLzi1uWefq",
]

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
  tokenUris = []
  for (i in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate }
    tokenUriMetadata.name = files[i].replace(".png", "")
    tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
    tokenUriMetadata.image = `ipfs://${imageUploadResponses[i].IpfsHash}`
    console.log(`Uploading ${tokenUriMetadata.name}...`)
    const metadataUploadResponse = await storeMetadata(tokenUriMetadata)
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
  }
  console.log("Token URIs uploaded! They are:")
  console.log(tokenUris)
  return tokenUris
}
module.exports.tags = ["all", "single", "main"]
