const getdocs = require("./getdocs.js");
const embedding = require("./embedding.js");
const { queryMilvus } = require("./milvus.js");

const generate = async (openai, mongo, milvus, question, repoUUID) => {
  // Create embedding for question
  const vector = await embedding(openai, question);

  // Query Milvus for similar documents
  const results = await queryMilvus(milvus, vector, repoUUID);

  // Get the fileUUIDs from the results
  const fileUUIDs = results.map((result) => result.fileUUID);

  console.log(fileUUIDs);
  // Get the contents of the files
  const files = await getdocs(mongo, repoUUID, fileUUIDs);

  const contents = files.map((file) => file.content);
  // Generate summary
  const combined = contents.join("\n\n");

  const message = [
    {
      role: "user",
      content: `${question}\n\nHere are some documents that might help answer the question, use them if they relate to the problem:\n\n${combined}`,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: message,
  });

  return response.data.choices[0].message.content;
};

module.exports = generate;
