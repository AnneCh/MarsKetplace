// This scripts mints an NFT and lists it directly on the MarsKetplace

//NOT FINISHED YET

const { ethers } = require("hardhat")

async function mintAndList() {
    const marsKetplace = await ethers.getContract("MarsKetplace")
    const nftMint = await ethers.getContract("MintNFT")
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
