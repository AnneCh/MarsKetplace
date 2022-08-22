const { assert, expect } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT minting tests", function () {
      let mintNFT, deployer
      let _name = "Plot On Mars"
      let _symbol = "POM"

      //deploys the contract and gets an instance of it to work with
      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(["single"])
        mintSingle = await ethers.getContract("MintOneToken")
      })

      describe("Deployment", function () {
        it("Should have the correct name and symbol", async function () {
          expect(await mintSingle.name()).to.equal(_name)
          expect(await mintSingle.symbol()).to.equal(_symbol)
        })

        it("should set the right owner", async function () {
          expect(await mintSingle.owner()).to.equal(deployer.address)
        })
      })
    })
