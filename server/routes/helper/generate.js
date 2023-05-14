const getdocs = require("./getdocs.js");

const generate = async (instance, question, repoUUID) => {
  const query = { _id: repoUUID };
  const repository = await instance.findOne(query);

  const question = [
    {
      role: "user",
      content: `Summarize this code.\n\nOriginal file contents:\n\n${contents}`,
    },
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: question,
  });

  return {
    summary: response.data.choices[0].message.content,
    original: contents,
  };
};
