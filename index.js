
require('dotenv').config()

const express = require('express')
const app = express()

const database = require('./config/database/index')
database.conect()

const port = process.env.PORT

const routesApiV1 = require('./api/v1/routes/index.route')
routesApiV1(app)


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
