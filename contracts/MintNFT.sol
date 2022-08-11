// SPDX-License-Identifier: MIT

// contract that mints 10 NFTs that will then be sold on the market place

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MintNFT is ERC721, ERC721URIStorage, Ownable {

    //Helpers
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    string[] public _allTokenURIs;
    // this mapping allows to link the token ID to the corresponding index in the list of the tokenURIS
    mapping(uint256 => string) public _IDtoURI;

    event NFTMinted(string indexed uri, uint256 indexed tokenId);
    
    constructor() ERC721("Plot On Mars", "POM") {}



    function bulkMint(string[] memory uris)
        public
        onlyOwner
    {
        _allTokenURIs = uris;
        address to = msg.sender;
        for (uint i = 0; i < uris.length; i++) {
            safeMint(to, uris[i]);
        }
    }

    function safeMint(address to, string memory uri)
        internal
        onlyOwner
    {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _IDtoURI[tokenId]=uri;
        emit NFTMinted(uri, tokenId);
    }


    function getTokenId() public view returns(uint256){
        return _tokenIds.current();
    }


    // function to view a specific URI related to a tokenID
    function viewURIs(uint256 i) public view returns(string memory){
        string memory unique = _allTokenURIs[i];
        return unique;
    }

     // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}

// list NFTs URIs /pinata
// mintNFT OK