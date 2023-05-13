/*
Embedding: Generate an embedding based on data
Input: Text Data
Output: Embeddings
What it does:
Calls OpenAI API to create embeddings based on the text data
*/
const embedding = async (openai, data) => {
  const response = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: data,
  })
  return response.data.data[0].embedding
}

module.exports = embedding
