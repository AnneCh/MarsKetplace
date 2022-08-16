const { assert, expect, expectEvent } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//skip test if not on localhost/hardhat
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT minting tests", function () {
      let marsketplace, deployer
      let price = ethers.utils.parseEther("1")

      //deploys the contract and gets an instance of it to work with
      // the beforeEach() will also need to deploy the contract that will mint the NFTs,
      // and approve this contract to sell those NFTs
      // mint NFTs and retrieve their contract addresses
      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user = accounts[1]
        await deployments.fixture(["marsKetplace"])
        marsketplace = await ethers.getContract("MarsKetplace")
      })
    })
