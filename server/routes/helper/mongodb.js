/*
Inserts data into mongodb
Input: Repo UUID, File UUID, Path, Summary, Original Contents, Embedding
Output: None
What it does: 
Stores data in mongodb in the repository UUID with the file UUID as key
*/
const {Repository} = require('../mongo/data')
function insertData(
  repoUuid,
  fileUuid,
  path,
  summary,
  originalContents,
  embedding,
) {
  // Create new file data
  const fileData = {
    _id: fileUuid,
    path,
    summary,
    contents: originalContents,
    embedding,
  }

  // Find the repository with the given UUID
  Repository.findByIdAndUpdate(
    repoUuid,
    {$set: {[`files.${fileUuid}`]: fileData}},
    {new: true, upsert: true},
  )
    .then((doc) => {
      console.log('Successfully inserted data:', doc)
    })
    .catch((err) => {
      console.error('Error inserting data:', err)
    })
}

module.exports = insertData
