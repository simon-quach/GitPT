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
const traverse = async (openai, octokit, instance, owner, repo, path = '') => {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
  })

  for (const item of response.data) {
    if (item.type === 'dir') {
      // Recursively traverse this subdirectory
      await traverse(openai, octokit, instance, owner, repo, item.path)
    } else if (item.type === 'file' && isSupportedFile(item.name)) {
      // This is a file, so we'll summarize, embed, and add to the vector
      try {
        const repoUUID = await getCommitSHA(owner, repo)
        const summary = await summarize(
          openai,
          octokit,
          owner,
          repo,
          item.path,
          repoUUID,
        )
        const vector = await embedding(openai, summary)
        const fileUUID = generateUUID() // Assuming generateUUID is a function to generate a unique ID
        await addToMilvus(instance, vector, repoUUID, fileUUID)
      } catch (error) {
        console.error(`Error processing file ${item.path}:`, error)
      }
    }
  }
}

const isSupportedFile = (filename) => {
  // Update this function to check if a file is supported based on its name or extension
  // For now, let's assume all files are supported
  return true
}

module.exports = traverse
