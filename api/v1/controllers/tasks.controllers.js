
const TaskModel = require('../models/tasks.model')
const paginationHelpers = require('../../../helpers/pagination.helpers')

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  let filter  = {}
  let sort = {}
  if (req.query.status) {
    const status = req.query.status

    filter = {
      status,
    }

  }

  // START SORT

  if (req.query.sortKey && req.query.sortValue) {
    const value = req.query.sortValue
    const sortKey = req.query.sortKey

    sort[sortKey] = value

  }

  // END SORT

  // START PAGINATION
  let initPagination = {
    currentPage: 1,
    limitPage: 2
  }

  const numberOfTasks = await TaskModel.countDocuments()
  const pagination = paginationHelpers(initPagination, req.query, numberOfTasks)

  // END PAGINATION

  const tasks = await TaskModel.find(
    filter,
    {
      deleted: false
    }
  )
    .sort(sort)
    .limit(pagination.limitPage)
    .skip(pagination.skip)
  
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

// [GET]

