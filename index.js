
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()


app.use(cors())

const database = require('./config/database/index')
database.conect()

const bodyParser = require('body-parser')
app.use(cookieParser())

const port = process.env.PORT

// bodyParser for json
app.use(bodyParser.json())

const routesApiV1 = require('./api/v1/routes/index.route')
routesApiV1(app)



app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
