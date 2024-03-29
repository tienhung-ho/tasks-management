const express = require('express')

const router = express.Router()

// controllers
const taskController = require('../controllers/tasks.controllers')



router.get('/', taskController.index)


router.get('/detail/:id', taskController.detail)

router.patch('/edit', taskController.edit)

router.patch('/change-status', taskController.changeStatus)

router.patch('/change-multi', taskController.changeMulti)

router.post('/create', taskController.create)

router.delete('/delete', taskController.delete)


module.exports = router
