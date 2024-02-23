const taskRoutes = require('./task.route')
const usersRoutes = require('./users.route')

// middlewares
const usersMiddlewares = require('../../../middlewares/auth.middlewares') 

module.exports = (app) => {
  const version = '/api/v1'

  app.use(version + '/tasks',
  usersMiddlewares.verifyAccessToken,
  taskRoutes)
  app.use(version + '/users', usersRoutes)

}

