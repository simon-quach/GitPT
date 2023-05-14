const breadcrumb = async (instance, repoUUID) => {
  const paths = []
  const repository = await instance.findOne({_id: repoUUID})
  if (repository) {
    const files = repository.files
    for (const [key, value] of files.entries()) {
      paths.push({path: value.path, uuid: value._id})
    }
  }
  return paths
}

module.exports = breadcrumb
