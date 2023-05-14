const getdocs = async (instance, repoUUID, fileUUIDs) => {
  const query = {_id: repoUUID}
  const repository = await instance.findOne(query)
  const contents = []
  const filesMap = new Map(repository.files.entries())

  for (const fileUUID of fileUUIDs) {
    const file = filesMap.get(fileUUID)
    contents.push(file.contents)
  }
  return contents
}

module.exports = getdocs
