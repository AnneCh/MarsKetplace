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

      // bulkMint()
      describe("It mints 10NFTs", function () {
        it("Should be reverted as caller is not owner", async function () {
          await expect(mintNFT.connect(user).bulkMint(tokensUris)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          )
        })
        it("Should emit the NFtMinted event after each token minted", async function () {
          for (i = 0; i < tokensUris.length; i++) {
            let index = i + 1
            await expect(mintNFT.bulkMint(tokensUris))
              .to.emit(mintNFT, "NFTMinted")
              .withArgs(tokensUris[i])
          }
        })

        //after calling buklMint(), grab the tokenURIs and test them individually = getURI(0)="ipfs://..."
        describe("Each token URI is properly initialized", function () {
          it("Should set the token URIs to their correct ipfs addresses", async function () {
            await mintNFT.bulkMint(tokensUris)
            //assumes that the bulkMint() is correctly working. If it is, it will initialize _allTokenURIs and viewUris() will return them
            for (i = 0; i < tokensUris.length; i++) {
              expect(await mintNFT.viewURIs(i)).to.equal(tokensUris[i])
              console.log(await mintNFT.viewURIs(i), "is equal to", tokensUris[i])
            }
          })
        })
      })

      describe("View token ID to check that counter is at 10", function () {
        let tokencounter = 10
        it("Should return a token counter of 10 if all NFTs have been successfully minted", async function () {
          await mintNFT.bulkMint(tokensUris)
          expect(await mintNFT.getTokenId()).to.equal(tokencounter)
        })
      })
    })