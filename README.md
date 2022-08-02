A.Project definition
B.How to run our project
C.Resources that helped

A

1. What this project does/is
   A decentralized platform selling unique NFTs representing a plot of land on Mars

2. How is it built
    1. A contract that mints 10 unique NFTs hosted on IPFS through Pinata. That contract is the `original_owner` of the NFTs
    2. A second contract that allows EOA to buy those NFTs from the `original_owner`
       2.1 It must be able to receive ETH, and allow one single address (`original_owner`) to withdraw the ETH
       2.2 It must transfer the ownership of an NFT contract's address from the `original_owner` to the `new_owner`

B Run the project

-   clone this github repository
-   run `yarn install` to install dependencies
-   `yarn hardhat deploy` to deploy all the deploy scripts
