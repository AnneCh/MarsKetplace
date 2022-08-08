const { assert, expect } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//Arrange-Act-Assert (AAA)
// if we have defined an error in our solidity code, we must wrap the logic corresponding
//in a catch/try{}

//skip test if on localhost/hardhat
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic NFT minting tests", function () {
          let mintNFT, deployer, instanceContract
          let _name = "Plot On Mars"
          let _symbol = "POM"
          let tokensUris = [
              "ipfs://QmaGmVJianGd3wzdfRNFZXWA9UeMdLFMBX5cZZSZjNeckP",
              "ipfs://QmaGV6P2knFkPdStvPsNXjJjehEysfnK7e4tShJAvpuPrx",
              "ipfs://QmcdbzSUFhRF98ppNHf83yhPJ2jHjP5Lpuov9Wzi4aYZF4",
              "ipfs://QmP8W1KEC2td2VPn3tbEYjFBZ2yV6jZh5Fbe2rGjzqCMwS",
              "ipfs://QmdL2QjcLPjd1RLwHK1GNuNQSt5b4ZXupuaGYtUi3Lqqz5",
              "ipfs://QmaJqsMKbFLLTZszY2rprPRncDReLTnhHVdz2U7aScxFNS",
              "ipfs://QmYeioLfMcTUNSABndwqJz7sjaeA7quF1fMGq2tziSE2T3",
              "ipfs://QmW7nRHE7J5L36n9NvxspwNfSbEPRcFvDF4kUkscZHehyZ",
              "ipfs://QmUcCwpskbvQydNa3rcSpCftsPAmBgovn6WnZYTeZw4NpU",
              "ipfs://QmdyTVfRymf2kFrrfdNq2FGHYX4gx5YDT1DvgmkccSee1U",
          ]

          //deploys the contract and gets an instance of it to work with
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["mintnft"])
              mintNFT = await ethers.getContract("MintNFT")
          })

          // constructor
          describe("Deployment", function () {
              it("Should have the correct name and symbol", async function () {
                  expect(await mintNFT.name()).to.equal(_name)
                  expect(await mintNFT.symbol()).to.equal(_symbol)
              })
              it("should set the right owner", async function () {
                  expect(await mintNFT.owner()).to.equal(deployer.address)
              })
              //   it("Should set _allTokenURIs to 10 strings", async function () {
              //       expect(await mintNFT.viewURIs).to.equal(tokensUris)
              //   })
              // NOT WORKING
          })

          // safeMint()

          // only the owner can call the function
          describe("The owner can call the safeMint function", function () {
              it("Should be reverted as caller is not owner", async function () {
                  await expect(mintNFT.connect(user).safeMint()).to.be.revertedWith(
                      "caller is not the owner"
                  )
              })
          })

          // an event is emitted after each mint
          describe("At the end of safeMint(), an event should be emitted", function () {})

          //after first deployment, grab the tokenURIs and test them individually = getURI(0)="ipfs://..."
          describe("Each token URI is properly initialized", function () {
              it("Should set the 1st token URI to its correct ipfs address", async function () {
                  expect(await mintNFT.viewURIs()).to.equal(tokensUris[0])
              })
              //   it("Should set the 2nd token URI to its correct ipfs address", function () {})
              //   it("Should set the 3rd token URI to its correct ipfs address", function () {})
              //   it("Should set the 4th token URI to its correct ipfs address", function () {})
              //   it("Should set the 5th token URI to its correct ipfs address", function () {})
              //   it("Should set the 6th token URI to its correct ipfs address", function () {})
              //   it("Should set the 7th token URI to its correct ipfs address", function () {})
              //   it("Should set the 8th token URI to its correct ipfs address", function () {})
              //   it("Should set the 9th token URI to its correct ipfs address", function () {})
              //   it("Should set the 10th token URI to its correct ipfs address", function () {})
          })

          //           // one token URI should start with 'ipfs://'
          //           describe("The constructor should have initialized the token URIs", function () {
          //               it("should contain ipfs in the address", async function () {})
          //           })
      })
