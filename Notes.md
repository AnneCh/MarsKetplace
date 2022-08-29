# Things for later

## Smart Contract

1. Later on, the beneficiary of the freshly minted NFT should be our LotteryContract (it will be the same EOA deploying both contracts), instead of `msg.sender`
   (If `to` refers to a smart contract, it must implement IERC721Receiver.onERC721Received, which is called upon a safe transfer.
   )
2. Improve the MarsKetplace contract's test => contract's balance, does not work if several NFT's have been sold
