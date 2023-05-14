const {DataType, MetricType} = require('@zilliz/milvus2-sdk-node')

const addToMilvus = async (instance, milvusData) => {
  // Check if there is any data to process
  if (milvusData.length === 0) {
    return
  }

  // Get the repoUUID from the first item
  const repoUUID = milvusData[0].repoUUID

  const fields = milvusData.map((data) => {
    const {fileUUID, vector} = data
    return {
      fileUUID,
      vector,
    }
  })

  const data = {
    collection_name: 'Github',
    partitionName: repoUUID,
    fields_data: fields,
  }

  const response = await instance.insert(data)
  return response
}

const queryMilvus = async (instance, vector, repoUUID) => {
  const searchParams = {
    anns_field: 'vector',
    topk: 5,
    metric_type: MetricType.L2,
    params: JSON.stringify({nprobe: 16}),
  }

  const query = {
    collection_name: 'Github',
    partition_names: [repoUUID],
    vectors: [vector],
    search_params: searchParams,
    vector_type: DataType.FloatVector,
    output_fields: ['fileUUID'],
  }

  const response = await instance.search(query)
  return response
}

module.exports = {addToMilvus, queryMilvus}
