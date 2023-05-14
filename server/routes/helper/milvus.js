const {DataType, MetricType} = require('@zilliz/milvus2-sdk-node')

const addToMilvus = async (instance, vector, repoUUID, fileUUID) => {
  const data = {
    collection_name: 'Github',
    partitionName: repoUUID,
    fieldsData: [
      {
        fileUUID: fileUUID,
        vector: vector,
      },
    ],
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
