const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { storeImages, storeMetadata } = require("../utils/upload-to-pinata")
const { verify } = require("../utils/verify")

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
}

const imagesLocation = "./nftImages/"

let tokenUris = [
  "ipfs://bafkreie5balvwjdkyqyacuiz53seankgr5vjslv5twforl5fzsvnv72vha",
  "ipfs://bafkreici3aprpvyf52htxkubvfkzcetbgjcsxyzp3ctza66qmwg4gt5dei",
  "ipfs://bafkreibztzzsuvdnjuhflkigq62looj236ukrug3t4z3m3vueotmejb2ia",
]

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenURI()
  }

  const mintNFT1 = await deploy("MintOneToken", {
    from: deployer,
    args: "",
    log: true,
    waitConfirmations: network.config.waitConfirmations,
  })

  log(`Contract deployed! the address of your contract is ${mintNFT1.address}`)

  const mintNFT2 = await deploy("MintTokenTwo", {
    from: deployer,
    args: "",
    log: true,
    waitConfirmations: network.config.waitConfirmations,
  })

  log(`Contract deployed! the address of your contract is ${mintNFT2.address}`)

  const mintNFT3 = await deploy("MintTokenThree", {
    from: deployer,
    args: "",
    log: true,
    waitConfirmations: network.config.waitConfirmations,
  })

  log(`Contract deployed! the address of your contract is ${mintNFT3.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(mintNFT1.address, args)
    await verify(mintNFT2.address, args)
    await verify(mintNFT3.address, args)
  }
  log("----------------------------------------------------")
}

async function handleTokenURI() {
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
  tokenUris = []
  for (i in imageUploadResponses) {
    let tokenUriMetadata = { ...metadataTemplate }
    tokenUriMetadata.name = files[i].replace(".png", "")
    tokenUriMetadata.description = `Get your own Plot On Mars! This one is ${tokenUriMetadata.name}`
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
