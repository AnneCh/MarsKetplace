const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeMetadata } = require("../utils/upload_to_pinata")

//NOT FINISHED YET
const imagesLocation = "./nftImages"

let tokenUris
if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
}

async function handleTokenUris() {
    //through the doc upload_to_pinata, we grab the newly uploaded images to pinata
    // add a metadata for each, grab the data and can finally return the tokenUris list to pass into our deploy function
    tokenUris = []
    const { responses: imageResponses, files } = await storeImages(imagesLocation)
    for (imageIndex in imageResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageIndex].replace(".png", " NFT token")
        tokenUriMetadata.description = `Congratulations! You own your very own Plot On Mars via this NFT, ${tokenUriMetadata.name}`
        tokenUriMetadata.image = `ipfs://${imageResponses[imageIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        const metadataUploadResponse = await storeMetadata(tokenUriMetadata)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log(`token Uris uploaded! They are: ${tokenUris} `)
    return tokenUris
}

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    params = []

    const mintNFT = await deploy("MintNFT", {
        from: deployer,
        args: params,
        log: true,
        waitConfirmations: network.config.waitConfirmations,
    })

    // get the IPFS hashes of our tokenURIs

    //verifying contract on etherscan
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(mintNFT.address, params)
    }

    await storeImages(imagesLocation)
}

module.exports.tags = ["all", "mintnft"]
