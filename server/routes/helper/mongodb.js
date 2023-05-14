/*
Inserts data into mongodb
Input: Repo UUID, File UUID, Path, Summary, Original Contents, Embedding
Output: None
What it does: 
Stores data in mongodb in the repository UUID with the file UUID as key
*/
const Repository = require('../mongo/data')
async function insertData(
  repoUuid,
  fileUuid,
  path,
  fullpath,
  summary,
  original,
  embedding,
) {
  // Create new file data
  const fileData = {
    _id: fileUuid,
    path,
    fullpath,
    summary,
    contents: original,
    embedding,
  }

  // Find the repository with the given UUID
  Repository.findByIdAndUpdate(
    repoUuid,
    {$set: {[`files.${fileUuid}`]: fileData}},
    {new: true, upsert: true},
  )
    .then((doc) => {
      return 200
    })
    .catch((err) => {
      console.error('Error inserting data:', err)
      return 500
    })
}

module.exports = insertData
