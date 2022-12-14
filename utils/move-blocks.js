//move transaction block in front so to have it confirmed on hardhat to update the DB
const { network } = require("hardhat")

function sleep(timeInMs) {
  return new Promise((resolve) => setTimeout(resolve, timeInMs))
}

async function moveBlocks(amount, sleepAmount = 0) {
  console.log("moving blocks...")
  for (index = 0; index < amount; index++) {
    await network.provider.request({
      method: "evm_mine", //can't do that on a real blockchain, obvio
      params: [],
    })
    if (sleepAmount) {
      console.log(`Sleeping for ${sleepAmount}`)
      await sleep(sleepAmount)
    }
  }
}

module.exports = {
  moveBlocks,
  sleep,
}
