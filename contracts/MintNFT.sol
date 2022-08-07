// SPDX-License-Identifier: MIT

// contract that mints 10 NFTs that will then be sold on the market place

pragma solidity ^0.8.7;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintNFT is ERC721URIStorage, Ownable {

    //Helpers
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    string[] internal _allTokenURIs;
    uint256 public tokenId;
    string internal indexedURI; 
    // this mapping allows to link the token ID to the corresponding index in the list of the tokenURIS
    mapping(uint256 => string[]) public _IDtoURI;

    event NFTMinted(uint256, string);
    
    constructor(string[10] memory tokenUris) ERC721("Plot On Mars", "POM") {
        _allTokenURIs = tokenUris;
    }


    //first, write a mint() function calling _safeMint() and _setTokenURI
    function safeMint() public onlyOwner {
        for(uint256 i=0; i<_allTokenURIs.length; i++){
            tokenId = _tokenIds.current();
            _safeMint(msg.sender, tokenId);
            _IDtoURI[tokenId].push(_allTokenURIs[i]);
            _setTokenURI(tokenId,_allTokenURIs[i]);
            _tokenIds.increment();
            emit NFTMinted(tokenId, _allTokenURIs[i]);
        }
    }

    function getTokenId() public returns(uint256){
        tokenId = _tokenIds.current();
        return tokenId;
    }

    function getURI(uint256 index) public returns(string memory){
        indexedURI = _allTokenURIs[index];
        return indexedURI;
    }
}

// list NFTs URIs /pinata
// mintNFT 
// create a for loop to mint the NFTs in a batch and not one after the other => mint everything in one single transaction
