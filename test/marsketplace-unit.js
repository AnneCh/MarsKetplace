const { assert, expect, expectEvent } = require("chai")
const { network, deployment, ethers, deployments } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

//skip test if not on localhost/hardhat
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Unit MarsKetplace tests", function () {
      let marsketplace, deployer
      let price = ethers.utils.parseEther("1")

      //deploys the contract and gets an instance of it to work with
      // the beforeEach() will also need to deploy the contract that will mint the NFTs,
      // and approve this contract to sell those NFTs
      // mint NFTs and retrieve their contract addresses
      beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        user = accounts[1]
        await deployments.fixture(["marsKetplace"])
        marsketplace = await ethers.getContract("MarsKetplace")
      })

      describe("List item function", async () => {
        it("Should revert if price is 0", async () => {
          let price = ethers.utils.parseEther("0")
          expect(
            await marsketplace.listItem(nftaddress.address, tokenId, price)
          ).to.be.reverted.with("MarsKetplace_PriceCantBeZero")
        })
        it("Should revert if the marsKetplace contract is not approved", async () => {})
        it("Should emit an event ItemListed", async () => {})
        it("Should only allow the owner to list an NFT", async () => {})
        it("Should revert if the NFT is already listed", async () => {})
      })

      describe("buyItem function")
    })
