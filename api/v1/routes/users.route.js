const express = require('express')

const router = express.Router()

// controllers
const usersControllers = require('../controllers/users.controllers')

// middlewares
const usersMiddlewares = require('../../../middlewares/auth.middlewares')

router.post('/register', usersControllers.register)

router.post('/login', usersControllers.login)

router.get('/detail', 
usersMiddlewares.verifyAccessToken,
usersControllers.detail)

router.get('/listuser', 
usersMiddlewares.verifyAccessToken,
usersControllers.getAllUsers)

router.post('/refreshtoken', 
usersControllers.refreshAccessToken)

router.post('/logout',
usersControllers.logout)


router.post('/password/forgot', usersControllers.forgotPassword)

router.post('/password/otp', usersControllers.otpPassword)

router.post('/password/reset', usersControllers.resetPassword)



module.exports = router
