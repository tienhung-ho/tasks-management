
require('dotenv').config()

const express = require('express')

const app = express()


const database = require('./config/database/index')

database.conect()

const port = process.env.PORT


app.get('/task', (req, res) => {
  res.json('ok')
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
