const { assert, expect, expectEvent } = require("chai")
const { network, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//skip test if not on localhost/hardhat
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Unit MarsKetplace tests", function () {
      let marsketPlace, oneNftDeployed, NftMarsketPlace, oneNFT, deployer, buyer
      let price = ethers.utils.parseEther("1")
      const TOKENID = 0

      //deploys the contract and gets an instance of it to work with
      // the beforeEach() will also need to deploy the contract that will mint the NFTs,
      // and approve this contract to sell those NFTs
      // mint NFTs and retrieve their contract addresses
      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        buyer = accounts[1]
        await deployments.fixture(["all"])
        marsketPlace = await ethers.getContract("MarsKetplace")
        NftMarsketPlace = marsketPlace.connect(deployer)
        oneNftDeployed = await ethers.getContract("MintOneToken")
        oneNFT = oneNftDeployed.connect(deployer)
        await oneNFT.mintNft()
      })

      describe("List item function", async () => {
        it("should list and sell an NFT", async () => {
          await oneNFT.approve(marsketPlace.address, TOKENID)
          await NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
          const buyerConnected = marsketPlace.connect(buyer)
          await buyerConnected.buyNFT(oneNftDeployed.address, TOKENID, { value: price })
          const newNFtOwner = await oneNftDeployed.ownerOf(TOKENID)
          const balance = await marsketPlace.getBalance()
          assert(newNFtOwner.toString() == buyer.address)
          assert(balance.toString() == price.toString())
        })

        it("Should revert if price is 0", async () => {
          await oneNFT.approve(marsketPlace.address, TOKENID)
          await expect(
            NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, 0)
          ).to.be.revertedWith("PriceCantBeZero")
        })
        it("Should revert if the marsKetplace contract is not approved", async () => {
          await expect(
            NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
          ).to.be.revertedWith("NotApproved")
        })
        it("Should list and emit an event ItemListed", async () => {})
        it("Should only allow the owner to list an NFT", async () => {})
        it("Should revert if the NFT is already listed", async () => {})
      })

      describe("buyItem function", async () => {
        it("should revert if NFT is not listed", async () => {})
        it("should revert if the price isn't correct", async () => {})
        it("should update the contract's balance", async () => {})
        it("Should emit an NFTBought event", async () => {})
      })

      describe("Cancel listing function", async () => {
        it("Should emit an update ItemListed event", async () => {})
      })

      describe("withdrawSales function", async () => {
        it("should revert if the caller is not the contract's owner", async () => {})
        it("should revert if the balance is 0", async () => {})
        it("Should revert if bool success is false", async () => {})
      })

      describe("getListing function", async () => {
        it("Should get the correct listing", async () => {})
      })
    })
