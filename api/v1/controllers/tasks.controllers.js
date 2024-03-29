
const TaskModel = require('../models/tasks.model')

// Helpers
const paginationHelpers = require('../../../helpers/pagination.helpers')
const searchHelpers = require('../../../helpers/search.helpers')
const { log } = require('console')

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  let filter = {}
  let sort = {}
  const status = req.query.status
  const userId = req.user._id

  if (status) {
    filter.status = req.query.status
  }

  filter.$or = [
    {
      createdBy: userId },
    {
      listUsers: userId }
  ]


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


  // START SEARCH
  let objSearch = searchHelpers(req.query)

  if (req.query.keyWord) {
    filter.title = objSearch.regex
  }

  // END SEARCH 

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
  catch (err) {
    res.json('404 Not found')
  }
}

// [PATCH] /api/v1/tasks/change-status
module.exports.changeStatus = async (req, res) => {
  try {
    const status = req.body.status
    const id = req.body.id


    if (status) {
      await TaskModel.updateOne({
        _id: id
      }, {
        status
      })

    }
    res.json({
      code: 200,
      message: 'Updated!'
    })
  }
  catch (err) {
    res.json({
      code: 400,
      message: 'Could not update!'
    })
  }
}

// [PATCH] /api/v1/tasks/change-status
module.exports.changeMulti = async (req, res) => {
  try {
    const { ids, key, value } = req.body

    if (ids.length > 0) {
      switch (key) {
        case "status":
          await TaskModel.updateMany({
            _id: { $in: ids }
          }, { status: value }
          )
          res.json({
            code: 200,
            message: 'Updated!'
          })
          break

        case "delete":
          await TaskModel.updateMany({
            _id: { $in: ids }
          }, {
            deleted: true,
            deletedAt: new Date()
          }
          )
          res.json({
            code: 200,
            message: 'Deleted!'
          })
          break


        default:
          res.json({
            code: 400,
            message: 'Not Found ITEM!'
          })
      }
    }


  }
  catch (err) {
    res.json({
      code: 400,
      message: 'Something wrong!'
    })
  }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {

    const data = new TaskModel(req.body)
    data.createdBy = req.user._id
    data.save()

    res.json({
      code: 200,
      message: 'Created!',
      data: data
    })
  }
  catch (err) {
    res.json({
      code: 400,
      message: 'Something wrong!'
    })
  }
}

// [PATCH] /api/v1/tasks/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.body.id

    if (id) {
      const data = req.body
      await TaskModel.updateOne({
        _id: id,
      }, data)

      res.json({
        code: 200,
        message: 'Updated!',
      })
    }
  }
  catch (err) {
    res.json({
      code: 400,
      message: 'Something wrong!'
    })
  }
}

// [DELETE] /api/v1/tasks/delete
module.exports.delete = async (req, res) => {
  try {
    const id = req.body.id

    if (id) {
      await TaskModel.updateOne({
        _id: id,
      }, {
        deleted: true,
        deletedAt: new Date()
      })

      res.json({
        code: 200,
        message: 'Deleted!',
      })
    }
  }
  catch (err) {
    res.json({
      code: 400,
      message: 'Something wrong!'
    })
  }
}

