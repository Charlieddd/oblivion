const express = require('express')
const router = express.Router()
const {v4: uuidV4} = require('uuid')

router.get('/', async (req, res) => {
  res.render('index')
})

module.exports = router