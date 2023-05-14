const getdocs = async (instance, repoUUID, fileUUIDs) => {
  const query = {_id: repoUUID}
  const repository = await instance.findOne(query)
  const files = []
  const filesMap = new Map(repository.files.entries())

  for (const fileUUID of fileUUIDs) {
    const file = filesMap.get(fileUUID)
    files.push(file)
  }
  return files
}

module.exports = getdocs
