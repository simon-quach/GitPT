/*
Recursive traverse from root of github repository
Input: RepoLink
Output: None
What it does:
Do tree traversal on repository
Call summarize on each supported leaf
Call embedding based on summary
Call add to vector with embedding
*/
const path = require('path')
const {getCommitSHA} = require('./returntree')
const summarize = require('./summarize')
const embedding = require('./embedding')

const {v4: uuidv4} = require('uuid')
const traverse = async (
  openai,
  octokit,
  instance,
  owner,
  repo,
  commitSha,
  path = '',
) => {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
  })

  // Create arrays to store data for Milvus and MongoDB
  let milvusData = []
  let mongoData = []

  for (const item of response.data) {
    if (item.type === 'dir') {
      // Recursively traverse this subdirectory
      try {
        const {milvusData: subdirMilvusData, mongoData: subdirMongoData} =
          await traverse(
            openai,
            octokit,
            instance,
            owner,
            repo,
            commitSha,
            item.path,
          )
        milvusData = milvusData.concat(subdirMilvusData)
        mongoData = mongoData.concat(subdirMongoData)
      } catch (err) {
        console.log(err)
        if (err.response.status === 429) {
          // If we hit the rate limit, wait 10seconds and try again
          await new Promise((resolve) => setTimeout(resolve, 10000))
          const {milvusData: subdirMilvusData, mongoData: subdirMongoData} =
            await traverse(
              openai,
              octokit,
              instance,
              owner,
              repo,
              commitSha,
              item.path,
            )
          milvusData = milvusData.concat(subdirMilvusData)
          mongoData = mongoData.concat(subdirMongoData)
        }
        milvusData = milvusData.concat([])
        mongoData = mongoData.concat([])
      }
    } else if (item.type === 'file' && isSupportedFile(item.name)) {
      console.log(item.path)
      // This is a file, so we'll summarize, embed, and add to the vector
      // Get the commit SHA for this file
      const repoUUID = commitSha

      // Call the summarize function
      let summary = ''
      let original = ''
      try {
        const obj = await summarize(openai, octokit, owner, repo, item.path)
        summary = obj.summary
        original = obj.original
      } catch (err) {
        console.log(err)
        continue
      }
      // Call the embedding function
      const vector = await embedding(openai, summary)

      // Generate a file UUID
      const fileUUID = uuidv4()

      // Push the data to the arrays
      milvusData.push({vector, repoUUID, fileUUID})
      mongoData.push({
        repoUUID,
        fileUUID,
        path: item.path,
        fullpath: item.html_url,
        summary,
        original,
        embedding: vector,
      })
    }
  }

  // Return the data
  return {milvusData, mongoData}
}

const isSupportedFile = (filename) => {
  // Array of supported file extensions
  const supportedExtensions = [
    '.js',
    '.jsx',
    '.py',
    '.java',
    '.cpp',
    '.h',
    '.cs',
    '.swift',
    '.m',
    '.mm',
    '.rb',
    '.php',
    '.go',
    '.rs',
    '.kt',
    '.ts',
    '.tsx',
    '.sh',
    '.pl',
    '.pm',
    '.R',
    '.scala',
    '.html',
    '.css',
    '.md',
  ]

  // Get the file extension
  const ext = path.extname(filename)

  // Return true if the file extension is in the array of supported extensions
  return supportedExtensions.includes(ext)
}

module.exports = traverse
