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
        await oneNFT.approve(marsketPlace.address, TOKENID)
      })

      describe("List item function", async () => {
        it("Should revert if price is 0", async () => {
          await expect(
            NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, 0)
          ).to.be.revertedWith("MarsKetplace__PriceCantBeZero")
        })

        // tested successfully, integrated the contract's approval in the beforeEach()
        // it("Should revert if the marsKetplace contract is not approved", async () => {
        //   await expect(
        //     NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
        //   ).to.be.revertedWith("MarsKetplace__NotApproved")
        // })

        it("Should list and emit an event ItemListed", async () => {
          const event = `ItemListed(${deployer.address}, ${oneNftDeployed.address}, ${TOKENID}, ${price})`
          expect(await NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)).to.emit(
            event
          )
        })

        it("Should only allow the owner to list an NFT", async () => {
          const buyerConnected = marsketPlace.connect(buyer)
          await expect(
            buyerConnected.listItem(oneNftDeployed.address, TOKENID, price)
          ).to.be.revertedWith("MarsKetplace__NotOwner")
        })

        it("Should revert if the NFT is already listed", async () => {
          await NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
          const error = `MarsKetplace__AlreadyListed("${oneNftDeployed.address}", ${TOKENID})`
          await expect(
            NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
          ).to.be.revertedWith(error)
        })
      })

      describe("buyNFT function", async () => {
        it("should revert if NFT is not listed", async () => {
          const buyerConnected = marsketPlace.connect(buyer)
          const error = `MarsKetplace__NotListed("${oneNftDeployed.address}", ${TOKENID})`
          await expect(
            buyerConnected.buyNFT(oneNftDeployed.address, TOKENID, { value: price })
          ).to.be.revertedWith(error)
        })
        it("should revert if the price is incorrect", async () => {
          let wrongPrice = ethers.utils.parseEther("0.1")
          await NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
          const buyerConnected = marsketPlace.connect(buyer)
          const punk = `MarsKetplace__PriceNotMet("${oneNftDeployed.address}", ${TOKENID}, ${wrongPrice})`
          await expect(
            buyerConnected.buyNFT(oneNftDeployed.address, TOKENID, { value: wrongPrice })
          ).to.be.revertedWith(punk)
        })
        it("should update the contract's balance", async () => {
          await NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
          const buyerConnected = marsketPlace.connect(buyer)
          await buyerConnected.buyNFT(oneNftDeployed.address, TOKENID, { value: price })
          const balance = await marsketPlace.getBalance()
          assert(balance.toString() == price.toString()) // works for one sale, but not if several sales have been made
        })

        it("should delete the purchased NFT from the s_NFTListed mapping", async () => {
          await NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
          const buyerConnected = marsketPlace.connect(buyer)
          await buyerConnected.buyNFT(oneNftDeployed.address, TOKENID, { value: price })
          expect(marsketPlace.getListing(oneNftDeployed.address, TOKENID)).to.be.reverted
        })
        it("Should emit an NFTBought event", async () => {})
      })

      // it("should list and sell an NFT", async () => {
      //   await NftMarsketPlace.listItem(oneNftDeployed.address, TOKENID, price)
      //   const buyerConnected = marsketPlace.connect(buyer)
      //   await buyerConnected.buyNFT(oneNftDeployed.address, TOKENID, { value: price })
      //   const newNFtOwner = await oneNftDeployed.ownerOf(TOKENID)
      //   const balance = await marsketPlace.getBalance()
      //   assert(newNFtOwner.toString() == buyer.address)
      //   assert(balance.toString() == price.toString()) // balance of the MarsKetplace contract is the same as seller's balance
      // })

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
