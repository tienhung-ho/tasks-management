
const TaskModel = require('../models/tasks.model')


// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const tasks = await TaskModel.find({
    deleted: false
  })
  
  res.json(tasks)
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id
  
    const task = await TaskModel.findOne({
      _id: id,
      deleted: false
    })
  
    res.json(task)
  }
  catch(err) {
    res.json('404 Not found')
  }
}

