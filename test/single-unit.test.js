const { assert, expect } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT deployment contract tests", function () {
      let mintNft, deployer
      let _name = "Plot On Mars"
      let _symbol = "POM1"
      let _tokenURI = "ipfs://bafkreicyl6zlj3nltg7cqgmz462xw5oqgv6qprvuv2yhdewnckadl6h4ku"

      //deploys the contract and gets an instance of it to work with
      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        await deployments.fixture(["single"])
        mintNft = await ethers.getContract("MintOneToken")
      })

      describe("Deployment", function () {
        it("Should have the correct name and symbol", async function () {
          const tokenCounter = await mintNft.getTokenCounter()
          const name = await mintNft.name()
          const symbol = await mintNft.symbol()
          assert.equal(tokenCounter.toString(), "0")
          assert.equal(name, _name)
          assert.equal(symbol, _symbol)
        })
        it("Should set the correct tokenURI", async function () {
          await mintNft.mintNft()
          const tokenURI = await mintNft.tokenURI(0)
          assert.equal(tokenURI, _tokenURI)
        })
      })
    })
