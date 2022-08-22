A.Project definition
B.How to run our project
C.Smart Contracts

# A

1. What this project does/is
   A decentralized platform selling unique NFTs representing a plot of land on Mars

2. How is it built
    1. A contract that mints 10 unique NFTs hosted on IPFS through Pinata. That contract is the `original_owner` of the NFTs
    2. A second contract that allows EOA to buy those NFTs from the `original_owner`
       2.1 It must be able to receive ETH, and allow one single address (`original_owner`) to withdraw the ETH
       2.2 It must transfer the ownership of an NFT contract's address from the `original_owner` to the `new_owner`

# B Run the project

-   clone this github repository
-   run `yarn install` to install dependencies
-   `yarn hardhat deploy` to deploy all the deploy scripts

# C Smart Contracts

## MintNFT.sol

The Mint contract will be deployed and called by the owner(designer?) of the NFTs (us).

The contract will take in as parameters, the list of `tokenUris` that the `safeMint()` function will need in order to mint the NFTs.

For now (08-07-22), the owner of the NFTs will be `msg.sender`, the options being the following :
a) we choose the `MarsKetplace` contract to be the owner of the NFTs and sell them
b) `msg.sender` remains the owner, but gives the permission to `MarsKetplace` to sell the NFTs on its behalf.

### Variables

#### Contract's variables

\_tokenIds | Counter/openzeppelin | private | The Counter's helper contract allows us to safely increment only by 1 the counter that represents the token ID of each NFT. The current counter can be retrieved and incremented ||

\_allTokenURIs | array of strings | internal | list of all the token URIs (10) representing each NFT's location on IPFS ||

\tokenId | uint256 | public | token ID of a specific NFT, variable not initialized until an NFT is minted ||

\indexedURI | string | internal | single token URI, mostly created for a view function/test ||

\_IDtoURI | mapping(uint256=>string[]) | private | links indexes on array of tokenURIs to a tokenID ||

\NFTMinted | event | returns the token ID and the token URI of the minted NFT ||

#### Helpers

Counters | counter | external | lbrary from Open Zeppelin to safely use a counter variable and increment/decrement it ||

### Functions

#### Constructor()

The constuctor of this contract will only take a list of `tokenUris` as a parameter and initialize the `_allTokenURIs` array of strings with the passed in list of `tokenUris`.
Depending on whether we already have the list of `tokenUris` or we need to upload our images to Pi~nata and get token URIs

#### safeMint()

The public `safeMint` function is being called from the ERC721 contract and is being applied the `onlyOwner` modifier from Open Zeppelin to secure that only the owner of the contract can call this function.

This function must get the current `_tokenIds` so to pass it in the `_safeMint()` function that we call from Open Zeppelin, preceded by the recipient's address, here, `msg.sender`.

It also sets the Token URI of the newly minted NFT. To do this, we call `_setTokenURI` from Open Zeppelin, passing into the function the `tokenId` and `tokenUri`

#### getTokenId()

A public view function that returns the current `tokenId`

#### getURI()

A public view function that returns the string of the URI of the corresponding index (mostly for tests)
