const { assert } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//skip test if on localhost/hardhat
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT minting tests", function () {
          let mintNFT, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["mintnft"])
              mintNFT = await ethers.getContract("MintNFT")
          })
      })