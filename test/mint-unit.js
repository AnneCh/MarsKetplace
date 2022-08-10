const { assert, expect, expectEvent } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//Arrange-Act-Assert (AAA)
// if we have defined an error in our solidity code, we must wrap the logic corresponding
//in a catch/try{}

//skip test if on localhost/hardhat
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic NFT minting tests", function () {
      let mintNFT, deployer
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
      })

      //after first deployment, grab the tokenURIs and test them individually = getURI(0)="ipfs://..."
      describe("Each token URI is properly initialized", function () {
        it("Should set the 1st token URI to its correct ipfs address", async function () {
          for (i = 0; i < tokensUris.length; i++) {
            expect(await mintNFT.viewURIs(i)).to.equal(tokensUris[i])
            console.log(await mintNFT.viewURIs(i), "is equal to", tokensUris[i])
          }
        })
      })

      // safeMint()

      // only the owner can call the function
      describe("The owner can call the bulkMint function", function () {
        it("Should be reverted as caller is not owner", async function () {
          await expect(mintNFT.connect(user).bulkMint(tokensUris)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          )
        })
        it("Should emit the NFtMinted event after each token minted", async function () {
          for (i = 0; i < tokensUris.length; i++) {
            await expect(mintNFT.bulkMint(tokensUris))
              .to.emit(mintNFT, "NFTMinted")
              .withArgs(deployer, tokensUris[i])
          }
        })
      })
    })
