const { assert } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
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
              await deployments.fixture(["mintnft"])
              mintNFT = await ethers.getContract("MintNFT")
          })

          // the tokenUris have been initialized, the lenfth of _allTokenURIs should be 10

          // after first deployment, grab the tokenURIs and test them individually = _allTokenURIs[0]="ipfs://..."

          // an event is emitted after each mint

          // The beneficiary (`to`) is msg.sender
          describe("After minting, the owner of the NFTs should be msg.sender", function () {})
      })
