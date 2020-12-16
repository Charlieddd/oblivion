const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('map/index')
})

module.exports = router