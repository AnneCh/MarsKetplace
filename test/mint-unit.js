const { assert } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
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

          describe("Mints an NFT", () => {
              it("sets the tokenID to 1", async function () {
                  const tokenID = mintNFT.getTokenId()
                  assert.equal(tokenID.toString(), "1")
              })
              //=> to review, not passing test
          })
      })
