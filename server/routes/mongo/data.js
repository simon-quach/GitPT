const mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')

// SCHEMA FOR files
const FileDataSchema = new mongoose.Schema({
  _id: {type: String, default: uuidv4},
  path: {
    type: String,
    required: true,
  },
  fullpath: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  contents: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
})

// Repsitory Schema
// Define the Repository schema
const RepositorySchema = new mongoose.Schema({
  _id: {type: String, default: uuidv4},
  files: {
    type: Map,
    of: FileDataSchema,
  },
})

const Repository = mongoose.model('Repository', RepositorySchema)

module.exports = Repository
