/*
Summarize one file through path
Input: Owner Name, Repo Name, Path, Repo UUID
Output: Summarization of github file at path, File UUID
What it does: 
Calls OpenAI API to summarize the github file
Creates a UUID for this file
Stores path, summary, and original contents in firebase under project UUID
*/

const axios = require('axios')
