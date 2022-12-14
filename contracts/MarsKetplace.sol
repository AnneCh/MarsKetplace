// SPDX-License-Identifier: MIT

// contract that sells 10 NFTs hosted on Pinata/IPFS for a defined amount of ETH

pragma solidity ^0.8.7;

// import IERC721 in order to approve our contract to sell the NFT on the behalf of our minter contract
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


error MarsKetplace__PriceCantBeZero();
error MarsKetplace__NotApproved();
error MarsKetplace__AlreadyListed(address nftAddress, uint256 tokenId);
error MarsKetplace__NotOwner();
error MarsKetplace__NotListed(address nftAddress, uint256 tokenId);
error MarsKetplace__PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);

contract MarsKetplace is ReentrancyGuard {

    //keep track of price and seller, to be added to mapping
    struct Listing{
        uint256 price;
        address seller;
    } 

    event NFTListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFTBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event NFTDeleted(
        address indexed nftAddress, 
        uint256 indexed tokenId
    );

    address contractOwner;
    // mapping to keep track of listed nfts with address, tokenId, price but also address of seller
    // NFT contract address -> NFt tokenId -> listing(price and seller)
    mapping(address => mapping(uint256 => Listing)) private s_NFTListed;

    //  modifier to make sure the NFT is not already listed
    // get the tokenId and address, create a listing, and if there is a price, it means the nft is alreayd listed
    modifier notListed(address nftAddress, uint256 tokenId, address owner) {
        Listing memory listing = s_NFTListed[nftAddress][tokenId];
        if (listing.price > 0) {
            revert MarsKetplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    // checking if the tokenId/nftAddress is correctly listed
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_NFTListed[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert MarsKetplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    // modifier isOwner from the IERC721 to make sure the seller is the owner of the NFT
    modifier isOwner(address nftAddress, uint256 tokenId, address spender){
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert MarsKetplace__NotOwner();
        }
        _;
    }

    constructor(){
        contractOwner = msg.sender;
    }
    /*
     * @notice Method to list the pre-minted NFTs on the marsKetplace, to buy them, and to cancel a specific listing
     * @param nftAddress: address of one NFT
     * @param tokenID: the token ID of one NFT
     * @param price: sale price of a listed NFT
     * @dev In this case, the original owner of all the NFTs will be the same, as well as the prices
     * @dev but making the list function parameterizable is a future-proof way to allow buyers to sell it again 

    */

    //// Main functions ////

    function listNft(address nftAddress, uint256 tokenId, uint256 price) external notListed(nftAddress, tokenId, msg.sender) isOwner(nftAddress, tokenId, msg.sender){
        //chekc that price is not 0
        if (price <= 0) {
            revert MarsKetplace__PriceCantBeZero();
        }
        //check that this contract has the approval to sell the token - openzeppelin getApproved() from IERC721
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)){
            revert MarsKetplace__NotApproved();
        }
        // update the listing s_NFTListed
        s_NFTListed[nftAddress][tokenId] = Listing(price, msg.sender);
        // need to emit an event 
        emit NFTListed(msg.sender, nftAddress, tokenId, price);

    }

    function buyNFT(address nftAddress, uint256 tokenId) external payable isListed(nftAddress, tokenId){
        Listing memory itemListed = s_NFTListed[nftAddress][tokenId];
        //make sure the price is correct
        if(msg.value != itemListed.price){
            revert MarsKetplace__PriceNotMet(nftAddress, tokenId, msg.value);
        }
        //delete the listing as being part of the listed NFT for sale:
        delete(s_NFTListed[nftAddress][tokenId]);
        //now call safeTransferFrom(ddress seller, addresser buyer, tokenId)
        IERC721(nftAddress).safeTransferFrom(itemListed.seller, msg.sender, tokenId);
        emit NFTBought(msg.sender, nftAddress, tokenId,itemListed.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId){
        // delete the listing from s_NFTListed
        delete (s_NFTListed[nftAddress][tokenId]);
        // need to emit an event 
        emit NFTDeleted(nftAddress, tokenId);
    }

    function updateNFTPrice(address nftAddress, uint256 tokenId, uint256 newPrice) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId){
        // only the owner can update the price of an already listed NFT
        s_NFTListed[nftAddress][tokenId].price = newPrice;
        emit NFTListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withdrawSales() external {
        // check that the address calling this function is the owner of the contract
        require(contractOwner == msg.sender, "You're not the owner of this contract, you cannot withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "Balance is 0, nothing to withdraw");
        (bool success,) = payable(msg.sender).call{value:balance}("");
        require(success, "Transfer Failed");
    }

    //// Getter function ////
    
    function getListing(address nftAddress, uint256 tokenId) external view returns(Listing memory){
        return s_NFTListed[nftAddress][tokenId];
    }

    function getBalance() external view returns(uint256){
        return address(this).balance;
    }

}
