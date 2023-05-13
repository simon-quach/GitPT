const getCommitSHA = async (owner, repo) => {
    try {
      const response = await octokit.repos.getBranch({
        owner: owner,
        repo: repo,
        branch: "main",
      });
  
      const mainBranch = response.data;
      const commitSHA = mainBranch.commit.sha;
      console.log("Commit SHA of the main branch:", commitSHA);
    } catch (error) {
      console.error("Error:", error);
    }

    return commitSHA;
  };
  

const getTreeSHA = async(commitSHA) => {
    const treeSHA = commitSHA.tree.sha;
    return treeSHA;
}

const getTreeObject = async(treeSHA) => {
    const treeObject = treeSHA.data;
    return treeObject;
}