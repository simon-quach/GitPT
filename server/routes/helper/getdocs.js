const getdocs = async (instance, repoUUID, fileUUID) => {
  const query = { _id: repoUUID };
  const repository = await instance.findOne(query);
  const contents = repository.files[fileUUID].contents;

  return contents;
};

module.exports = getdocs