const breadcrumb = async (instance, repoUUID, path) => {
  const paths = [];
  const repository = await instance.findOne({ _id: repoUUID });
  if (repository) {
    const files = repository.files;
    for (const [key, value] of files.entries()) {
      if (value.path.startsWith(path)) {
        paths.push(value.path);
      }
    }
  }
  return paths;
};

module.exports = breadcrumb;
