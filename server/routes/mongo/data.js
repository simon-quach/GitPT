import mongoose from 'mongoose'

// SCHEMA FOR MONGODB
const Data = new mongoose.Schema({
  name: {type: String, required: true},
  prompt: {type: String, required: true},
  photo: {type: String, required: true},
})

const DataSchema = mongoose.model('Data', Data)

export default DataSchema
