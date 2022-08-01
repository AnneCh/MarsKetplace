// SPDX-License-Identifier: MIT

// contract that sells 10 NFTs hosted on Pinata/IPFS for a defined amount of ETH

pragma solidity ^0.8.7;


// import IERC721 in order to approve our contract to sell the NFT on the behalf of our minter contract
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error MarsKetplace_PriceMustBeAboveZero();

contract MarsKetplace {

    // listItem can be called by our contract original owner of the NFTs
    // function listItem(address nftAddress, uint256 tokenId, uint256 price) external {
    //     if (price <= 0) {
    //         revert MarsKetplace_PriceMustBeAboveZero();
    //     }
    // }
}

 
// list NFTs on our marketplace
// => approve this contract to sell the NFT on the marketplace (use IERC721)

// any EOA can buy the NFT
// Update the NFT status to 'sld'
// withdraw proceeds NFT sales