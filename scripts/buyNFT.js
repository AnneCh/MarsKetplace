const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const TOKEN_ID = 0

async function buyNFT() {
  const marsKetplace = await ethers.getContract("MarsKetplace")
  const nft = await ethers.getContract("MintOneToken")
  const listing = await marsKetplace.getListing(nft.address, TOKEN_ID)
  const price = listing.price.toString()
  const tx = await marsKetplace.buyNFT(nft.address, TOKEN_ID, { value: price })
  await tx.wait(1)
  console.log("NFT Purchased!")
  if ((network.config.chainId = "31337")) {
    await moveBlocks(2, (sleepAmount = 1000))
  }
}

buyNFT()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
