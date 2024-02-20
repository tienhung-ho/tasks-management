const express = require('express')

const router = express.Router()

// controllers
const taskController = require('../controllers/tasks.controllers')



router.get('/', taskController.index)


router.get('/detail/:id', taskController.detail)

router.patch('/change-status', taskController.edit)

router.patch('/change-multi', taskController.changeMulti)

router.post('/create', taskController.create)


module.exports = router
