const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const indexRouter = require('./routes/index')
app.use('/', indexRouter)
const accountRouter = require('./routes/account')
app.use('/account', accountRouter)

app.listen(process.env.PORT || 3000)