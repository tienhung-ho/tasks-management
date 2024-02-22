const taskRoutes = require('./task.route')
const usersRoutes = require('./users.route')

module.exports = (app) => {
  const version = '/api/v1'

  app.use(version + '/tasks', taskRoutes)
  app.use(version + '/users', usersRoutes)

}

