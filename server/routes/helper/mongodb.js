/*
Inserts data into mongodb
Input: Repo UUID, File UUID, Path, Summary, Original Contents, Embedding
Output: None
What it does: 
Stores data in mongodb in the repository UUID with the file UUID as key
*/
const Repository = require('../mongo/data')

async function insertData(mongoData) {
  // Check if there is any data to process
  if (mongoData.length === 0) {
    return
  }

  // Get the repoUuid from the first item
  const repoUuid = mongoData[0].repoUUID

  // Prepare the updates
  const updates = {}
  for (const data of mongoData) {
    const {fileUUID, path, fullpath, summary, original, embedding} = data

    // Create new file data
    const fileData = {
      _id: fileUUID,
      path,
      fullpath,
      summary,
      contents: original,
      embedding,
    }

    // Add this to the updates
    updates[`files.${fileUUID}`] = fileData
  }

  // Find the repository with the given UUID and update it
  await Repository.findByIdAndUpdate(
    repoUuid,
    {$set: updates},
    {new: true, upsert: true},
  )
    .then(() => {
      console.log(`Data inserted for repository UUID: ${repoUuid}`)
    })
    .catch((err) => {
      console.error('Error inserting data:', err)
    })
}

module.exports = insertData
