// SPDX-License-Identifier: MIT

// contract that mints 10 NFTs that will then be sold on the market place

pragma solidity ^0.8.7;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintNFT is ERC721URIStorage, Ownable {

    //Helpers
    using Counters for Counters.Counter;
    
    // NFT variables 
    Counters.Counter private _tokenIds;
    string[] internal _allTokenURIs;
    uint256 public tokenId;

    
    constructor(string[10] memory tokenUris) ERC721("Plot On Mars", "POM") {
        _allTokenURIs = tokenUris;
    }


    //first, write a mint() function calling _safeMint() and _setTokenURI
    function safeMint() public onlyOwner {
        _tokenIds.increment();
        tokenId = _tokenIds.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId,_allTokenURIs[tokenId]);
    }

    function getTokenId() public returns(uint256){
        tokenId = _tokenIds.current();
        return tokenId;
    }
}

// list NFTs URIs /pinata
// mintNFT 
// create a for loop to mint the NFTs in a batch and not one after the other => mint everything in one single transaction
