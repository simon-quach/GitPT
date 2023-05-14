/*
Summarize one file through path
Input: Owner Name, Repo Name, Path, Repo UUID
Output: Summarization of github file at path, File UUID
What it does: 
Calls OpenAI API to summarize the github file
Creates a UUID for this file
Stores path, summary, and original contents in mongodb under repository UUID
*/
const summarize = async (openai, octokit, owner, repo, path) => {
  const gitResponse = await octokit.rest.repos.getContent({
    owner: owner,
    repo: repo,
    path: path,
  })

  const contents = Buffer.from(gitResponse.data.content, 'base64').toString()

  const messages = [
    {
      role: 'user',
      content: `Summarize this code.\n\nOriginal file contents:\n\n${contents}`,
    },
  ]
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: messages,
  })

  return {
    summary: response.data.choices[0].message.content,
    original: contents,
  }
}

module.exports = summarize
