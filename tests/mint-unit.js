const { assert } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { developmentChains } = require("../helper-hardhat-config")

//Arrange-Act-Assert (AAA)

//skip test if on localhost/hardhat
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT minting tests", function () {
          let mintNFT, deployer

          //deploys the contract and gets an instance of it to work with
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["mintnft"])
              mintNFT = await ethers.getContract("MintNFT")
          })

          // after first deployment, grab the tokenURIs and test them individually = getURI(0)="ipfs://..."
          describe("Each token URI is properly initialized", function () {
              it("Should set the 1st token URI to its correct ipfs address", function () {})
              it("Should set the 2nd token URI to its correct ipfs address", function () {})
              it("Should set the 3rd token URI to its correct ipfs address", function () {})
              it("Should set the 4th token URI to its correct ipfs address", function () {})
              it("Should set the 5th token URI to its correct ipfs address", function () {})
              it("Should set the 6th token URI to its correct ipfs address", function () {})
              it("Should set the 7th token URI to its correct ipfs address", function () {})
              it("Should set the 8th token URI to its correct ipfs address", function () {})
              it("Should set the 9th token URI to its correct ipfs address", function () {})
              it("Should set the 10th token URI to its correct ipfs address", function () {})
          })

          // only the owner can only be owner ("0xeAD5cb04207343C163b6B6D6bE627d3DC4Ca459b")
          describe("The owner can call the safeMint function", function () {})

          // test that other account cannot call the safeMint() with user account
          describe("The user account calling safeMint() should trigger a revert function", function () {})

          // the tokenUris have been initialized, the length of _allTokenURIs should be 10
          describe("The constructor should have initialized _allTokenURIs and should equal 10", function () {})

          // an event is emitted after each mint
          describe("At the end of safeMint(), an event should be emitted", function () {})

          // The beneficiary (`to`) is msg.sender
          describe("After minting, the owner of the NFTs should be msg.sender", function () {})
      })
