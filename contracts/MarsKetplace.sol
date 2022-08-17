// SPDX-License-Identifier: MIT

// contract that sells 10 NFTs hosted on Pinata/IPFS for a defined amount of ETH

pragma solidity ^0.8.7;

// import IERC721 in order to approve our contract to sell the NFT on the behalf of our minter contract
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error MarsKetplace_PriceCantBeZero();
error MarsKetplace_NotApproved();
error MarsKetplace_AlreadyListed(address nftAddress, uint256 tokenId);
error MarsKetplace_NotOwner();
error MarsKetplace_NotListed(address nftAddress, uint256 tokenId);
error MarsKetplace_PriceNotMet(address nftAddress, uint256 tokenId, uint256 price);

contract MarsKetplace {

    //keep track of price and seller, to be added to mapping
    struct Listing{
        uint256 price;
        address seller;
    } 

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    // mapping to keep track of listed nfts with address, tokenId, price but also address of seller
    // NFT contract address -> NFt tokenId -> listing(price and seller)
    mapping(address=> mapping(uint256 => Listing)) private s_NFTListed;

    //  modifier to make sure the NFT is not already listed
    // get the tokenId and address, create a listing, and if there is a price, it means the nft is alreayd listed
    modifier notListed(address nftAddress, uint256 tokenId,address owner){
        Listing memory listing = s_NFTListed[nftAddress][tokenId];
        if (listing.price > 0) {
            revert MarsKetplace_AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    // checking if the tokenId/nftAddress is correctly listed
    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_NFTListed[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert MarsKetplace_NotListed(nftAddress, tokenId);
        }
        _;
    }

    // modifier isOwner from the IERC721 to make sure the seller is the owner of the NFT
    modifier isOwner(address nftAddress, uint256 tokenId, address spender){
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender != owner) {
            revert MarsKetplace_NotOwner();
        }
        _;
    }

    /*
     * @notice Method to list the pre-minted NFTs on the marsKetplace
     * @param nftAddress: address of one NFT
     * @param tokenID: the token ID of one NFT
     * @param price: sale price of a listed NFT
     * @dev In this case, the original owner of all the NFTs will be the same, as well as the prices
     * @dev but making the list function parameterizable is a future-proof way to allow buyers to sell it again 

    */

    function listItem(address nftAddress, uint256 tokenId, uint256 price) external notListed(nftAddress, tokenId, msg.sender) isOwner(nftAddress, tokenId, msg.sender){
        //chekc that price is not 0
        if (price <= 0) {
            revert MarsKetplace_PriceCantBeZero();
        }
        //check that this contract has the approval to sell the token - openzeppelin getApproved() from IERC721
        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)){
            revert MarsKetplace_NotApproved();
        }
        // update the listing s_NFTListed
        s_NFTListed[nftAddress][tokenId] = Listing(price, msg.sender);
        // need to emit an event 
        emit ItemListed(msg.sender, nftAddress, tokenId, price);

    }

    function buyItem(address nftAddress, uint256 tokenId) external payable isListed(nftAddress, tokenId){
        Listing memory itemListed = s_NFTListed[nftAddress][tokenId];
        if(msg.value < itemListed.price){
            revert MarsKetplace_PriceNotMet(nftAddress, tokenId, itemListed.price);
        }
    }

}

 
// list NFTs on our marketplace
// => approve this contract to sell the NFT on the marketplace (use IERC721)

//create modifiers to check if the requested item is listed, check if it's not already listed when listing a new one
// any EOA can buy the NFT
// Update the NFT status to 'sold' = make it unavailable to be sold (front-end only?)
// keep track of NFT sales and seller's balance
// keep track of who owns which NFT
// withdraw proceeds of the NFT sales