// SPDX-License-Identifier: MIT

// contract that sells 10 NFTs hosted on Pinata/IPFS for a defined amount of ETH

pragma solidity ^0.8.7;

// import IERC721 in order to approve our contract to sell the NFT on the behalf of our minter contract
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error MarsKetplace_PriceCantBeZero();
error MarsKetplace_NotApproved();

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

    // create and add a modifier to make sure the NFT is not already listed
    function listItem(address nftAddress, uint256 tokenId, uint256 price) external {
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

}

 
// list NFTs on our marketplace
// => approve this contract to sell the NFT on the marketplace (use IERC721)

// any EOA can buy the NFT
// Update the NFT status to 'sld'
// withdraw proceeds NFT sales