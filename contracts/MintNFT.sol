// SPDX-License-Identifier: MIT

// contract that mints 10 NFTs that will then be sold on the market place

pragma solidity ^0.8.7;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintNFT is ERC721URIStorage, Ownable {

    //using Counters; library to secure incrementation by 1 only
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // list of all the token URIs
    string[] internal _allTokenURIs;
    //from there, write a function that will pick the token uri according to the tokenID=> if mint token id is 1, then the NFT#1 is to be minted
    //and the first URI of the list must be set
    string internal _tokenURI;
    
    constructor() ERC721("Plot On Mars", "POM") {}


    //first, write a mint() function calling _safeMint() and _setTokenURI
    function safeMint() public onlyOwner {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        //_setTokenURI(tokenId,_tokenURI);

    }

    
}

// list NFTs URIs /pinata
// mintNFT 
// create a for loop to mint the NFTs in a batch and not one after the other => mint everything in one single transaction
