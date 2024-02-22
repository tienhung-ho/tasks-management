const express = require('express')

const router = express.Router()

// controllers
const usersControllers = require('../controllers/users.controllers')



router.get('/register', usersControllers.register)



module.exports = router
