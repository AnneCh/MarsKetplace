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

### Variables

#### Contract's variables

\_tokenIds | Counter/openzeppelin | private | The Counter's helper contract allows us to safely increment only by 1 the counter that represents the token ID of each NFT. The current counter can be retrieved and incremented ||

tokenId | uint256 | public | token ID of a specific NFT, variable not initialized until an NFT is minted ||

Plots | enum | internal | list representing the name of each individual NFT (POM#) ||

\_allTokenURIs | array of strings | internal | list of all the token URIs (10) representing each NFT's location on IPFS

\_tokenToPlot | mapping(uint256=>enum) | private | links indexes on Plots to a tokenID (see if useful or not)

#### Helpers

Counters | counter | external | lbrary from Open Zeppelin to safely use a counter variable and increment/decrement it ||

### Functions

#### Constructor()

The constuctor of this contract will only take a list of `tokenUris` as a parameter and initialize the `_allTokenURIs` array of strings with the passed in list of `tokenUris`.
Depending on whether we already have the list of `tokenUris` or we need to upload our images to Pi~nata and get token URIs

#### safeMint()

The `safeMint` function is being called from the ERC721 contract and is being applied the `onlyOwner` modifier from Open Zeppelin to secure that only the owner of the contract can call this function.
