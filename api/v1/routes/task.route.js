const express = require('express')

const router = express.Router()

// controllers
const taskController = require('../controllers/tasks.controllers')



router.get('/', taskController.index)


router.get('/detail/:id', taskController.detail)

router.patch('/change-status', taskController.edit)

router.patch('/change-multi', taskController.changeMulti)


module.exports = router
