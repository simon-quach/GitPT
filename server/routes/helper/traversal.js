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
const path = require("path");
const getCommitSHA = require("./returntree");
const summarize = require("./summarize");
const embedding = require("./embedding");
const { addToMilvus } = require("./milvus");
const insertData = require("./mongodb");
const { v4: uuidv4 } = require("uuid");
const traverse = async (openai, octokit, instance, owner, repo, path = "") => {
  const response = await octokit.repos.getContent({
    owner,
    repo,
    path,
  });

  for (const item of response.data) {
    if (item.type === "dir") {
      // Recursively traverse this subdirectory
      await traverse(openai, octokit, instance, owner, repo, item.path);
    } else if (item.type === "file" && isSupportedFile(item.name)) {
      // This is a file, so we'll summarize, embed, and add to the vector
      try {
        // Get the commit SHA for this file
        const repoUUID = await getCommitSHA(owner, repo);
        // Call the summarize function
        const { summary, original } = await summarize(
          openai,
          octokit,
          owner,
          repo,
          item.path
        );
        // Call the embedding function
        const vector = await embedding(openai, summary);
        // Call the addToMilvus function
        const fileUUID = uuidv4();
        await addtomilvus(instance, vector, repoUUID, fileUUID);
        // Finally, add to MongoDB
        await insertData(
          repoUUID,
          fileUUID,
          item.path,
          summary,
          original,
          vector
        );
      } catch (error) {
        console.error(`Error processing file ${item.path}:`, error);
      }
    }
  }
};

const isSupportedFile = (filename) => {
  // Array of supported file extensions
  const supportedExtensions = [
    ".js",
    ".py",
    ".java",
    ".cpp",
    ".h",
    ".cs",
    ".swift",
    ".m",
    ".mm",
    ".rb",
    ".php",
    ".go",
    ".rs",
    ".kt",
    ".ts",
    ".sh",
    ".pl",
    ".pm",
    ".R",
    ".scala",
    ".html",
    ".css",
    ".xml",
    ".json",
    ".yaml",
    ".yml",
    ".md",
  ];

  // Get the file extension
  const ext = path.extname(filename);

  // Return true if the file extension is in the array of supported extensions
  return supportedExtensions.includes(ext);
};

module.exports = traverse;
