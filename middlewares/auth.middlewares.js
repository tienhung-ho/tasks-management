const jwt = require('jsonwebtoken')

module.exports.verifyAccessToken = async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    // header { authorization: 'Bearer ....' }
    const token = req.headers.authorization.split(' ')[1]

    jwt.verify(token, process.env.KEYSECRET, (err, decode) => {
      if(err) {
        return res.json({
          code: 400,
          success: false,
          message: 'Could not verify token!',
        })
      }

      req.user = decode
      
      next()
    })
  }
  else {
    return res.json({
      code: 400,
      success: false,
      message: 'Require authentication!',
    })
  }
  
}
