const getCommitSHA = async (octokit, owner, repo) => {
  const response = await octokit.repos.getBranch({
    owner: owner,
    repo: repo,
    branch: "main",
  });
  const mainBranch = response.data;
  const commitSHA = mainBranch.commit.sha;
  console.log("Commit SHA of the main branch:", commitSHA);
  return commitSHA;
};

const getTreeSHA = async (commitSHA) => {
  const treeSHA = commitSHA.tree.sha;

  return treeSHA;
};

const getTreeObject = async (treeSHA) => {
  const treeObject = treeSHA.data;
  return treeObject;
};

module.exports = { getCommitSHA, getTreeSHA, getTreeObject };
