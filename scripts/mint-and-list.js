// This scripts mints an NFT and lists it directly on the MarsKetplace

const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")
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
  console.log("NFT POM1 successfully listed on the MarsKetplace!")

  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000))
  }

  const nftMint2 = await ethers.getContract("MintTokenTwo")
  console.log("Minting NFT...")
  const nftTx2 = await nftMint2.mintNft()
  const nftTxReceipt2 = await nftTx2.wait(1)
  const tokenId2 = nftTxReceipt2.events[0].args.tokenId
  console.log("Approving MarsKetplace Contract to sell the NFT...")
  const approvalTx2 = await nftMint2.approve(marsKetplace.address, tokenId2)
  await approvalTx2.wait(1)
  console.log("Listing the NFT on the MarsKetplace...")
  const listTx2 = await marsKetplace.listNft(nftMint2.address, tokenId2, PRICE)
  await listTx2.wait(1)
  console.log("NFT POM2 successfully listed on the MarsKetplace!")

  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000))
  }

  const nftMint3 = await ethers.getContract("MintTokenThree")
  console.log("Minting NFT...")
  const nftTx3 = await nftMint3.mintNft()
  const nftTxReceipt3 = await nftTx3.wait(1)
  // now from `nftTxReceipt` we can get to the events emited and grab the argument we need
  const tokenId3 = nftTxReceipt3.events[0].args.tokenId
  // use `tokenId` to approve the marsKetplace contract
  console.log("Approving MarsKetplace Contract to sell the NFT...")
  const approvalTx3 = await nftMint3.approve(marsKetplace.address, tokenId3)
  await approvalTx3.wait(1)
  console.log("Listing the NFT on the MarsKetplace...")
  const listTx3 = await marsKetplace.listNft(nftMint3.address, tokenId3, PRICE)
  await listTx3.wait(1)
  console.log("NFT POM3 successfully listed on the MarsKetplace!")

  if (network.config.chainId == "31337") {
    await moveBlocks(2, (sleepAmount = 1000))
  }
}

mintAndList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
