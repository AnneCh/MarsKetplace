// update the front end to store the contract address

const { ethers, network } = require("hardhat")
const fs = require("fs")
const frontEndContractsFile = "../FrontEndMarsKetplace/constants/networkMappings.json"
const frontEndABILocation = "../FrontEndMarsKetplace/constants/"

module.exports = async function () {
  if (process.env.UPDATE_FRONT_END) {
    console.log("Updating front end")
    await updateContractAddresses()
    await updateABI()
  }
}

async function updateABI() {
  const nftMarsketplace = await ethers.getContract("MarsKetplace")
  fs.writeFileSync(
    `${frontEndABILocation}NftMarsketplace.json`,
    nftMarsketplace.interface.format(ethers.utils.FormatTypes.json)
  )
  // look for the interface documentation in hardhat, and FormatTypes in ethers docu
  const mintOneToken = await ethers.getContract("MintOneToken")
  fs.writeFileSync(
    `${frontEndABILocation}MintOneToken.json`,
    mintOneToken.interface.format(ethers.utils.FormatTypes.json)
  )

  const mintTokenTwo = await ethers.getContract("MintTokenTwo")
  fs.writeFileSync(
    `${frontEndABILocation}MintTokenTwo.json`,
    mintTokenTwo.interface.format(ethers.utils.FormatTypes.json)
  )

  const mintTokenThree = await ethers.getContract("MintTokenThree")
  fs.writeFileSync(
    `${frontEndABILocation}MintTokenThree.json`,
    mintTokenThree.interface.format(ethers.utils.FormatTypes.json)
  )
}

async function updateContractAddresses() {
  //get the contract
  const marsKetplace = await ethers.getContract("MarsKetplace")
  // get the chain id to identify which network we're on
  const chainId = network.config.chainId.toString()
  const contractAddresses = JSON.parse(fs.readFileSync(frontEndContractsFile, "utf8"))
  //check if the chainId is already in the JSON file, then replace it by the new one, otherwise add it
  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId]["MarsKetplace"].includes(marsKetplace.address)) {
      contractAddresses[chainId]["MarsKetplace"].push(marsKetplace.address)
    }
  } else {
    contractAddresses[chainId] = { MarsKetplace: [marsKetplace.address] }
  }
  //write data to the JSON file
  fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}

module.exports.tags = ["all", "frontend"]
