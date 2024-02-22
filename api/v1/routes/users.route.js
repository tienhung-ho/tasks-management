const express = require('express')

const router = express.Router()

// controllers
const usersControllers = require('../controllers/users.controllers')

router.post('/register', usersControllers.register)

router.post('/login', usersControllers.login)

router.post('/password/forgot', usersControllers.forgotPassword)

router.post('/password/otp', usersControllers.otpPassword)

router.post('/password/reset', usersControllers.resetPassword)



module.exports = router
