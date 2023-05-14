var express = require("express");
var router = express.Router();
var cors = require("cors");
var dotenv = require("dotenv");
dotenv.config();

const extractNameAndProject = require("./helper/getinfo.js");
const summarize = require("./helper/summarize.js");
const embedding = require("./helper/embedding.js");
const connectDB = require("./mongo/connect.js");
const { getCommitSHA } = require("./helper/returntree.js");
// MongoDB Setup
connectDB(process.env.MONGODB_URL);

// Middleware
router.use(express.json());
router.use(cors());

// Milvus Database Setup
const {
  MilvusClient,
  DataType,
  MetricType,
} = require("@zilliz/milvus2-sdk-node");
const config = require("../config.js");
const { uri, user, password, secure } = config;
const milvusClient = new MilvusClient(uri, secure, user, password, secure);

// OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
});
const openai = new OpenAIApi(configuration);

// Github API
const { Octokit } = require("@octokit/rest");
const { connect } = require("mongoose");
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* POST request to generate embedding */
router.post("/embed", async function (req, res, next) {
  try {
    const data = req.body.text;
    const embed = await embedding(openai, data);
    res.json({ embedding: embed });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/github", (req, res) => {
  try {
    const url = req.body.url; // Assuming the URL is passed in the request body
    console.log(url);
    // Call the extractNameAndProject function
    const result = extractNameAndProject(url);

    // Send the result as the response
    res.json(result);
  } catch (error) {
    // Handle the error if an invalid GitHub URL is provided
    res.status(400).json({ error: "Invalid GitHub URL" });
  }
});

router.post("/summarize", async (req, res) => {
  try {
    const owner = req.body.owner; // Assuming the owner is passed in the request body
    const repo = req.body.repo; // Assuming the repo is passed in the request body
    const path = req.body.path; // Assuming the path is passed in the request body

    // Call the summarize function
    const summary = await summarize(openai, octokit, owner, repo, path);

    // Send the summary as the response
    res.send(summary);
  } catch (error) {
    console.log(error);
    // Handle any errors that occurred during the process
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/commit-sha", async (req, res) => {
  try {
    const { owner, repo } = req.body; // Assuming the owner and repo are passed in the request body

    // Call the getCommitSHA function
    const commitSHA = await getCommitSHA(octokit, owner, repo);
    // Send the commit SHA as the response
    res.send(commitSHA);
  } catch (error) {
    console.log(error);
    // Handle any errors that occurred during the process
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
