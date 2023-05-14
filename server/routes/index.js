var express = require('express')
var router = express.Router()
var cors = require('cors')
var dotenv = require('dotenv')
dotenv.config()

const extractNameAndProject = require('./helper/getinfo.js')
const summarize = require('./helper/summarize.js')
const embedding = require('./helper/embedding.js')
const connectDB = require('./mongo/connect.js')
const {getCommitSHA} = require('./helper/returntree.js')
const traverse = require('./helper/traversal.js')
const {addToMilvus, queryMilvus} = require('./helper/milvus')
const insertData = require('./helper/mongodb')
const breadcrumb = require('./helper/breadcrumb.js')
const generate = require('./helper/generate.js')
const getdocs = require('./helper/getdocs.js')
const axios = require('axios')
const {v4: uuidv4} = require('uuid')

// MongoDB Setup
connectDB(process.env.MONGODB_URL)
const Repository = require('./mongo/data.js')

// Middleware
router.use(express.json())
router.use(cors())

// Milvus Database Setup
const {MilvusClient} = require('@zilliz/milvus2-sdk-node')
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
const {default: mongoose} = require('mongoose')
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

router.post('/github', (req, res) => {
  try {
    const url = req.body.url // Assuming the URL is passed in the request body
    console.log(url)
    // Call the extractNameAndProject function
    const result = extractNameAndProject(url)

    // Send the result as the response
    res.json(result)
  } catch (error) {
    // Handle the error if an invalid GitHub URL is provided
    res.status(400).json({error: 'Invalid GitHub URL'})
  }
})

router.post('/summarize', async (req, res) => {
  try {
    const owner = req.body.owner // Assuming the owner is passed in the request body
    const repo = req.body.repo // Assuming the repo is passed in the request body
    const path = req.body.path // Assuming the path is passed in the request body

    // Call the summarize function
    const summary = await summarize(openai, octokit, owner, repo, path)

    // Send the summary as the response
    res.send(summary)
  } catch (error) {
    console.log(error)
    // Handle any errors that occurred during the process
    res.status(500).json({error: 'Internal server error'})
  }
})

router.post('/commit-sha', async (req, res) => {
  try {
    const {owner, repo} = req.body // Assuming the owner and repo are passed in the request body

    // Call the getCommitSHA function
    const commitSHA = await getCommitSHA(octokit, owner, repo)
    // Send the commit SHA as the response
    res.send(commitSHA)
  } catch (error) {
    console.log(error)
    // Handle any errors that occurred during the process
    res.status(500).json({error: 'Internal server error'})
  }
})

router.post('/traverse', async (req, res) => {
  const {owner, repo} = req.body
  if (!owner || !repo) {
    return res.status(400).send('Missing owner or repo in request body')
  }

  try {
    // Call github api here to find name and project description
    // Create dummy data and insert into mongoData
    const repositoryUrl = `https://api.github.com/repos/${owner}/${repo}`
    const response = await axios.get(repositoryUrl)

    const {
      owner: {login: ownerName},
      description,
    } = response.data

    const dummyData = {
      fileUUID: 'metadata',
      path: '/',
      fullpath: `https://github.com/${owner}/${repo}`,
      summary: description,
      contents: ownerName,
      embedding: [],
    }

    const {milvusData, mongoData} = await traverse(
      openai,
      octokit,
      milvusClient,
      owner,
      repo,
    )
    await addToMilvus(milvusClient, milvusData)
    await insertData(mongoData.concat(dummyData))

    res.status(200).send('Successfully traversed repository')
  } catch (error) {
    console.error('Error traversing repository:', error)
    res.status(500).send('Error traversing repository')
  }
})

router.post('/query', async (req, res) => {
  try {
    // Assuming the request body has vector and repoUUID
    const {text, repoUUID} = req.body
    // Validate the request body
    if (!text || !repoUUID) {
      return res.status(400).json({message: 'Vector and repoUUID are required'})
    }

    const vector = await embedding(openai, text)
    const results = await queryMilvus(milvusClient, vector, repoUUID)
    return res.status(200).json(results)
  } catch (error) {
    console.error('Error querying Milvus:', error)
    return res
      .status(500)
      .json({message: 'An error occurred while querying Milvus'})
  }
})

router.post('/generate', async (req, res) => {
  try {
    // Assuming the request body contains 'instance', 'question', and 'repoUUID'
    const {question, repoUUID} = req.body

    console.log(question)

    const response = await generate(
      openai,
      Repository,
      milvusClient,
      question,
      repoUUID,
    )

    res.status(200).json({response})
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({error: 'An error occurred while processing the request'})
  }
})

router.get('/breadcrumb/:repoUUID', async (req, res) => {
  try {
    const repoUUID = req.params.repoUUID
    const paths = await breadcrumb(Repository, repoUUID)
    res.json(paths)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/getdocs/:repoUUID/:fileUUID', async (req, res) => {
  try {
    const {repoUUID, fileUUID} = req.params
    const files = await getdocs(Repository, repoUUID, [fileUUID])
    res.json(files[0])
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

router.get('/alldocs', async (req, res) => {
  try {
    const files = await Repository.find({})
    const ids = []
    files.forEach((file) => {
      const metadata = file.files.get('metadata')
      const obj = {
        id: file._id,
        name: metadata.fullpath.split('/').pop(),
        description: metadata.summary,
      }
      ids.push(obj)
    })
    res.json(ids)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

module.exports = router
