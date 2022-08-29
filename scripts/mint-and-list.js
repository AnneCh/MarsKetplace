// This scripts mints an NFT and lists it directly on the MarsKetplace

//NOT FINISHED YET

const { ethers } = require("hardhat")

const PRICE = ethers.utils.parseEther("1")

async function mintAndList() {
  const marsKetplace = await ethers.getContract("MarsKetplace")
  const nftMint = await ethers.getContract("MintOneToken")
  console.log("Minting NFT...")
  const nftTx = await nftMint.mintNft()
  const nftTxReceipt = await nftTx.wait(1)
  // now from `nftTxReceipt` we can get to the events emited and grab the argument we need
  const tokenId = nftTxReceipt.events[0].args.tokenId
  // use `tokenId` to approve the marsKetplace contract
  console.log("Approving MarsKetplace Contract to sell the NFT...")
  const approvalTx = await nftMint.approve(marsKetplace.address, tokenId)
  await approvalTx.wait(1)
  console.log("Listing the NFT on the MarsKetplace...")
  const listTx = await marsKetplace.listNft(nftMint.address, tokenId, PRICE)
  await listTx.wait(1)
  console.log("NFT successfully listed on the MarsKetplace!")
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
