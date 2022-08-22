const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//NOT FINISHED YET

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
}
const imagesLocation = "./nftImages/"

const tokenUri = "ipfs://QmaGmVJianGd3wzdfRNFZXWA9UeMdLFMBX5cZZSZjNeckP"

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

    log(`Contract deployed! the address is ${mintNFT.address}`)
}

module.exports.tags = ["all", "single", "main"]