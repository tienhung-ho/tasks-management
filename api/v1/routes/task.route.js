const express = require('express')

const router = express.Router()

// controllers
const taskController = require('../controllers/tasks.controllers')



router.get('/', taskController.index)


router.get('/detail/:id', taskController.detail)

router.patch('/change-status', taskController.edit)


module.exports = router
