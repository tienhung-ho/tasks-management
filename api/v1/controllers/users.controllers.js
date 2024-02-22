
const UserModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// [GET] /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    const record = req.body
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT))
    const hashedPassword = await bcrypt.hash(record.password, salt)

    const user = new UserModel ({
      fullName: record.fullName,
      email: record.email,
      password: hashedPassword
    })

    user.save()
    
    res.json({
      code: 200,
      message: 'Created!',
      data: user
    })

  }
  catch(err) {
    res.json({
      code: 400,
      message: 'Could not create!',
    })
  }
}
