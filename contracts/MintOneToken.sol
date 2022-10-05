// SPDX-License-Identifier: MIT

// contract that mints 1 NFT that will then be sold on the market place

pragma solidity ^0.8.7;


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MintOneToken is ERC721URIStorage {

    string public constant TOKEN_URI = 'ipfs://bafkreie5balvwjdkyqyacuiz53seankgr5vjslv5twforl5fzsvnv72vha';
    uint256 private s_tokenCounter;

    event NFTMinted(uint256 indexed tokenId);
    
    constructor() ERC721("Plot On Mars", "POM1") {
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