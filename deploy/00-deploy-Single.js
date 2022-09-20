const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { storeImages, storeMetadata } = require("../utils/upload-to-pinata")

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
}

const imagesLocation = "./nftImages/"

let tokenUri = "ipfs://QmQE3xUxXTHspvApiYbHQoNnpgwonQbxjZgcuXDfrAKu7e"

let tokenUris = [
  "ipfs://QmQE3xUxXTHspvApiYbHQoNnpgwonQbxjZgcuXDfrAKu7e",
  "ipfs://QmWYi6UqQu18eCpVHRW5RWU7ZoN2V2bV1rJLsGiTtaZStv",
  "ipfs://QmcaK5P16j5JWUV57nUhdBQd3hW6XGP8voTJEFgjAnBmpW",
]

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenURI()
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
    tokenUriMetadata.description = `Get your own Plot On Mars!`
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
