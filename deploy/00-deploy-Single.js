const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { storeImages, storeMetadata } = require("../utils/upload-to-pinata")

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
}

const imagesLocation = "./nftImages/"

let tokenUri = "ipfs://QmYBPE6hjuQf37vUi33jSoigYrph3DZwK9YayX3kQf77hN"

let tokenUris = [
  "ipfs://QmemEh8hNPQdt9ssWuDzv88Pg8gSgqWvhaBUkZE7mEAmFn",
  "ipfs://QmWFqmv4LZLXevTmyN9G3gh4TsuJFGEsrWXtvjR7bcyf3p",
  "ipfs://QmYBPE6hjuQf37vUi33jSoigYrph3DZwK9YayX3kQf77hN",
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
