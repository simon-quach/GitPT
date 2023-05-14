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
const {addToMilvus} = require('./milvus')
const insertData = require('./mongodb')
const {v4: uuidv4} = require('uuid')
const traverse = async (
  openai,
  octokit,
  instance,
  owner,
  repo,
  path = '',
  commitSha = '',
) => {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
  })
  if (commitSha === '') {
    commitSha = await getCommitSHA(octokit, owner, repo)
  }
  for (const item of response.data) {
    if (item.type === 'dir') {
      // Recursively traverse this subdirectory
      try {
        await traverse(
          openai,
          octokit,
          instance,
          owner,
          repo,
          item.path,
          commitSha,
        )
      } catch (err) {
        console.log(err)
      }
    } else if (item.type === 'file' && isSupportedFile(item.name)) {
      console.log(item.path)
      // This is a file, so we'll summarize, embed, and add to the vector
      // Get the commit SHA for this file
      const repoUUID = commitSha
      // console.log(repoUUID)
      // Call the summarize function
      const {summary, original} = await summarize(
        openai,
        octokit,
        owner,
        repo,
        item.path,
      )
      // console.log(summary)
      // console.log(original)
      // Call the embedding function
      const vector = await embedding(openai, summary)
      // Call the addToMilvus function
      const fileUUID = uuidv4()
      // console.log(fileUUID)
      await addToMilvus(instance, vector, repoUUID, fileUUID)
      // Finally, add to MongoDB
      await insertData(
        repoUUID,
        fileUUID,
        item.path,
        item.html_url,
        summary,
        original,
        vector,
      )
    }
  }
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
