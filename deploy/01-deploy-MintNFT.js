const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

//NOT FINISHED YET

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
}

module.exports.tags = ["all", "mintnft"]

/* functions to upload to pinata and handle token URIS:

let tokenUris

if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris()
}

async function handleTokenUris() {
    tokenUris = []
    => store image in IPFS then Store the metadata in IPFS

    return tokenUris
}

*/
