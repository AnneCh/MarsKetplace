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

const tokenUris = []

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    params = [tokenUris]

    const mintNFT = await deploy("MintNFT", {
        from: deployer,
        args: params,
        log: true,
        waitConfirmations: network.config.waitConfirmations,
    })

    //verifying contract on etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(mintNFT.address, params)
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
