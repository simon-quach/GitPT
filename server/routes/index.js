var express = require('express')
var router = express.Router()
var cors = require('cors')
var dotenv = require('dotenv')
dotenv.config()



// Middleware
router.use(express.json())
router.use(cors())

// Milvus Database Setup
const {MilvusClient, DataType, MetricType} = require('@zilliz/milvus2-sdk-node')
const config = require('../config.js')
const {uri, user, password, secure} = config
const milvusClient = new MilvusClient(uri, secure, user, password, secure)

// OpenAI API
const {Configuration, OpenAIApi} = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
})
const openai = new OpenAIApi(configuration)

// Github API 
const {Octokit} = require('@octokit/rest')
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'})
})

/* POST request to generate embedding */
router.post('/embed', async function (req, res, next) {
  try {
    const data = req.body.text
    const embed = await embedding(openai, data)
    res.json({embedding: embed})
  } catch (error) {
    res.status(500).json({error: error.toString()})
  }
})

module.exports = router
