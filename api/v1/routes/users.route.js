const express = require('express')

const router = express.Router()

// controllers
const usersControllers = require('../controllers/users.controllers')

router.post('/register', usersControllers.register)
router.post('/login', usersControllers.login)



module.exports = router
