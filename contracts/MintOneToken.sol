// SPDX-License-Identifier: MIT

// contract that mints 1 NFT that will then be sold on the market place

pragma solidity ^0.8.7;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MintOneToken is ERC721URIStorage, Ownable {

    string public constant TOKEN_URI = "ipfs://QmaGmVJianGd3wzdfRNFZXWA9UeMdLFMBX5cZZSZjNeckP";
    string internal _tokenURI; 
    uint256 private s_tokenCounter;
    // this mapping allows to link the token ID to the corresponding index in the list of the tokenURIS
    mapping(uint256 => string) public _IDtoURI;

    event NFTMinted(uint256);
    
    constructor() ERC721("Plot On Mars", "POM") {
        s_tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        emit NFTMinted(s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}