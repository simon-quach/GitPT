var express = require('express')
var router = express.Router()
router.use(express.json())

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
