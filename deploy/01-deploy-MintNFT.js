const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeMetadata } = require("../utils/upload-to-pinata")

//NOT FINISHED YET

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
}
const imagesLocation = "./nftImages/"

const tokenUris = [
  "ipfs://QmaGmVJianGd3wzdfRNFZXWA9UeMdLFMBX5cZZSZjNeckP",
  "ipfs://QmaGV6P2knFkPdStvPsNXjJjehEysfnK7e4tShJAvpuPrx",
  "ipfs://QmcdbzSUFhRF98ppNHf83yhPJ2jHjP5Lpuov9Wzi4aYZF4",
  "ipfs://QmP8W1KEC2td2VPn3tbEYjFBZ2yV6jZh5Fbe2rGjzqCMwS",
  "ipfs://QmdL2QjcLPjd1RLwHK1GNuNQSt5b4ZXupuaGYtUi3Lqqz5",
  "ipfs://QmaJqsMKbFLLTZszY2rprPRncDReLTnhHVdz2U7aScxFNS",
  "ipfs://QmYeioLfMcTUNSABndwqJz7sjaeA7quF1fMGq2tziSE2T3",
  "ipfs://QmW7nRHE7J5L36n9NvxspwNfSbEPRcFvDF4kUkscZHehyZ",
  "ipfs://QmUcCwpskbvQydNa3rcSpCftsPAmBgovn6WnZYTeZw4NpU",
  "ipfs://QmdyTVfRymf2kFrrfdNq2FGHYX4gx5YDT1DvgmkccSee1U",
]

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
  }

  //params = [tokenUris]

  const mintNFT = await deploy("MintNFT", {
    from: deployer,
    args: "",
    log: true,
    waitConfirmations: network.config.waitConfirmations,
  })

  //verifying contract on etherscan
  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(mintNFT.address)
  }
}

async function handleTokenUris() {
  const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
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

module.exports.tags = ["all", "mintnft", "main"]
