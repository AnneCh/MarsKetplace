const pinataSDK = require("@pinata/sdk")
const fs = require("fs")
const path = require("path")
require("dotenv").config

const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = pinataSDK(pinataApiKey, pinataApiSecret)

async function storeImages(imagesFilePath) {
  const fullImagesPath = path.resolve(imagesFilePath)
  const files = fs.readdirSync(fullImagesPath)
  let responses = []
  console.log("Uploading to Pinata!")
  for (fileIndex in files) {
    //Pinata SDK requires a stream of the files to upload
    const stream = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
    try {
      const response = await pinata.pinFileToIPFS(stream)
      responses.push(response)
    } catch (error) {
      console.log(error)
    }
  }
  console.log("Your images have been uploaded to Pinata successfully!")
  return { responses, files }
  //the responses are the hashes from IPFS
}

async function storeMetadata(metadata) {
  try {
    const response = await pinata.pinJSONToIPFS(metadata)
    return response
  } catch (error) {
    console.log(error)
  }
  return null
}

module.exports = { storeImages, storeMetadata }
