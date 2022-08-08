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

          //deploys the contract and gets an instance of it to work with
          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              user = accounts[1]
              await deployments.fixture(["mintnft"])
              mintNFT = await ethers.getContract("MintNFT")
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

          // only the owner can only be owner
          describe("The owner can call the safeMint function", function () {
              it("Should be reverted as caller is not owner", async function () {
                  await expect(mintNFT.connect(user).safeMint()).to.be.revertedWith(
                      "caller is not the owner"
                  )
              })
          })

          // after first deployment, grab the tokenURIs and test them individually = getURI(0)="ipfs://..."
          //   describe("Each token URI is properly initialized", function () {
          //       it("Should set the 1st token URI to its correct ipfs address", function () {})
          //       it("Should set the 2nd token URI to its correct ipfs address", function () {})
          //       it("Should set the 3rd token URI to its correct ipfs address", function () {})
          //       it("Should set the 4th token URI to its correct ipfs address", function () {})
          //       it("Should set the 5th token URI to its correct ipfs address", function () {})
          //       it("Should set the 6th token URI to its correct ipfs address", function () {})
          //       it("Should set the 7th token URI to its correct ipfs address", function () {})
          //       it("Should set the 8th token URI to its correct ipfs address", function () {})
          //       it("Should set the 9th token URI to its correct ipfs address", function () {})
          //       it("Should set the 10th token URI to its correct ipfs address", function () {})
          //   })

          //           // one token URI should start with 'ipfs://'
          //           describe("The constructor should have initialized the token URIs", function () {
          //               it("should contain ipfs in the address", async function () {})
          //           })

          //       // an event is emitted after each mint
          //       describe("At the end of safeMint(), an event should be emitted", function () {})

          //       // The beneficiary (`to`) is msg.sender
          //       describe("After minting, the owner of the NFTs should be msg.sender", function () {})
      })
