const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')


const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

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
const driveRouter = require('./routes/drive')
app.use('/drive', driveRouter)
const mapRouter = require('./routes/map')
app.use('/map', mapRouter)


// app.get('/', async (req, res) => {
//     res.redirect(`/${uuidV4}`)
// })
  
// app.get('/:room', async (req, res) => {
//     res.render('room', {roomId: req.params.room})
// })

app.listen(process.env.PORT || 3000)