const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  res.render('account/index')
})

module.exports = router