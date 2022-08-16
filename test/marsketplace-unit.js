const { assert, expect, expectEvent } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//skip test if not on localhost/hardhat
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT minting tests", function () {
      let marsketplace, deployer

      //deploys the contract and gets an instance of it to work with
      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user = accounts[1]
        await deployments.fixture(["marsKetplace"])
        marsketplace = await ethers.getContract("MarsKetplace")
      })
    })
