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
              user = accounts[1]
              await deployments.fixture(["single"])
              mintNFT = await ethers.getContract("MintOneToken")
          })

          describe("Deployment", function () {
              it("Should have the correct name and symbol", async function () {
                  expect(await mintNFT.name()).to.equal(_name)
                  expect(await mintNFT.symbol()).to.equal(_symbol)
              })

              it("should set the right owner", async function () {
                  expect(await mintNFT.owner()).to.equal(deployer.address)
              })
          })
      })
