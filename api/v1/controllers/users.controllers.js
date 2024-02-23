
const UserModel = require('../models/users.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../../../../../project/backend/app/models/user.model')
const ForgotPasswordModel = require('../models/forgot-password.model')

// helpers
const genarate = require('../../../helpers/genarate')
const sendMail = require('../../../helpers/send-mail')

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  try {
    const record = req.body

    const existEmail = await UserModel.findOne({
      email: record.email,
      deleted: false
    })

    if (existEmail) {
      res.json({
        code: 400,
        message: 'Exist email!',
      })
    }

    else {

      const salt = await bcrypt.genSalt(parseInt(process.env.SALT))
      const hashedPassword = await bcrypt.hash(record.password, salt)
  
      const user = await UserModel.create({
        fullName: record.fullName,
        email: record.email,
        password: hashedPassword
      })

      const accessToken = genarate.genarateAccessToken(user._id, 'user')
      const refreshToken = genarate.genarateRefreshToken(user._id)

      user.tokenUser = accessToken
      user.refreshTokenUser = refreshToken
      user.save()

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
      })
  
      res.json({
        code: 200,
        message: 'Created!',
        data: {
          accessToken,
          refreshToken
        }
      })
    }


  }
  catch(err) {
    res.json({
      code: 400,
      message: 'Could not create!',
    })
  }
}

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  try {
    const record = req.body

    const existUser = await UserModel.findOne({
      email: record.email,
      deleted: false
    })

    if (existUser) {
      const corectUser = await bcrypt.compare(record.password, existUser.password)
      // console.log(corectUser);
      if (corectUser) {
        const accessToken = genarate.genarateAccessToken(existUser._id, 'user')
        const refreshToken = genarate.genarateRefreshToken(existUser._id)

        existUser.tokenUser = accessToken
        existUser.refreshTokenUser = refreshToken
        existUser.save()


        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000
        })

        res.json({
          code: 200,
          message: 'Logined',
          accessToken
        })
      }
      else {
        res.json({
          code: 400,
          message: 'Sai mật khẩu',
        })
      }


    }
    
    else {
      res.json({
        code: 400,
        message: 'Email is not exist!',
      })
    }


  }
  catch(err) {
    res.json({
      code: 400,
      message: 'Could not login!',
    })
  }
}

// [POST] /api/v1/users/password/forgot
module.exports.forgotPassword = async (req, res) => {

  const email = req.body.email

  const user = await UserModel.findOne({
    email: email,
    deleted: false
  })

  if (!user) {
    res.json({
      code: 400,
      message: 'Email is not exist!',
    })

    return
  }

  const otp = genarate.genarateRanNumber(4)

  const objForgotPass = {
    email,
    otp,
    expireAt: Date.now(),
  }

  const forgotPassword = new ForgotPasswordModel(objForgotPass)
  forgotPassword.save()

  // SEND EMAIL 
  const sub = "Mã OTP CỦA BẠN!"
  const html = `Mã OTP xác minh là <b>${otp}</b> sẽ hết hạn sau 1p`

  sendMail.sendMail(email, sub, html)

  res.json({
    code: 200,
    message: 'Đã gửi mã otp qua email',
  })
}

// [POST] /api/v1/users/password/otp
module.exports.otpPassword = async (req, res) => {

  const { email, otp } = req.body

  console.log(email, otp);

  const forgotPassWord = await ForgotPasswordModel.findOne({
    email, 
    otp
  })

  if (!forgotPassWord) {
    res.json({
      code: 400,
      message: 'Otp không hợp lệ!',
    })

    return
  }

  const user = await UserModel.findOne({
    email,
    deleted: false
  })

  const token = genarate.genarateAccessToken(user._id, 'user')

  user.tokenUser = token
  user.save()

  res.cookie('refreshToken', user.refreshTokenUser, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  })

  res.json({
    code: 200,
    message: 'Xác thực thành công!',
  })

}

// [POST] /api/v1/users/password/reset
module.exports.resetPassword = async (req, res) => {
  const password  = req.body.password
  const token = req.cookies.accessToken


  const user = await UserModel.findOne({
    tokenUser: token,
  })

  const corectPass = await bcrypt.compare(password, user.password) 

  if (corectPass) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu mới khác với mật khẩu cũ!',
    })

    return
  }

  const keySecret = process.env.KEYSECRET
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT))
  const hashedPassword = await bcrypt.hash(password, salt)
  
  const newToken = genarate.genarateAccessToken(user._id, 'user')

  user.tokenUser = newToken
  user.password  = hashedPassword

  user.save()


  res.cookie('refreshToken', user.refreshTokenUser, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  })

  res.json({
    code: 200,
    message: 'Thay đổi thành công1',
  })

}

// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {

  try {
    const { _id } = req.user
    

    const user = await UserModel.findOne({
      _id,
      deleted: false
    }).select('fullName email status')
  
    res.json({
      code: 200,
      message: 'Chi tiết user!',
      user,
    })

  }
  catch(err) {

    res.json({
      code: 400,
      message: 'Please Login!',
    })
  }
}


// [POST] /api/v1/users/refreshtoken
module.exports.refreshAccessToken = async (req, res) => {
  try {
    
    // Lấy cookie đã được lưu
    const cookie = req.cookies
  
    if (!cookie && !cookie.refreshToken) {
      throw new Error ('Do not have refresh Token!')
    }
    // kiểm tra xem có khớp với token đã lưu không

    const result = jwt.verify(cookie.refreshToken, process.env.KEYSECRET)
    const response = await UserModel.findOne({
        _id: result._id,
        refreshTokenUser: cookie.refreshToken,
        deleted: false
    })

    return res.json({
          code: 200,
          success: response ? true : false,
          message: 'Access Token!',
          newAccessToken: response ? genarate.genarateAccessToken(response._id, response.role) : "Refresh Token not matched"
        })

    // jwt.verify(cookie.refreshToken, process.env.KEYSECRET, async (err, decode) => {
    //   if (err) {
    //     return res.json({
    //       code: 400,
    //       success: false,
    //       message: 'Could not verify token!',
    //     })
    //   }
      // Tìm user theo điều kiện refreshToken
      // const response = await UserModel.findOne({
      //   _id: decode._id,
      //   refreshTokenUser: cookie.refreshToken,
      //   deleted: false
      // })
  
    //   return res.json({
    //     code: 200,
    //     success: response ? true : false,
    //     message: 'Access Token!',
    //     newAccessToken: response ? genarate.genarateAccessToken(response._id, response.role) : "Refresh Token not matched"
    //   })
    
    // })
  }
  catch(err) {
    return res.json({
      code: 400,
      success: false,
      message: 'Something wrong at refresh token!',
    })
  }

}

// [POST] /api/v1/users/logout
module.exports.logout = async (req, res) => {
  try {

    // Lấy cookie đã được lưu
    const cookie = req.cookies
  
    if (!cookie && !cookie.refreshToken) {
      throw new Error ('Do not have refresh Token!')
    }

    
    await UserModel.findOneAndUpdate({
      refreshTokenUser: cookie.refreshToken
    },
    {
      refreshTokenUser: ''
    },
    {
      new: true
    }
    )
    
    res.clearCookie('refreshToken', { httpOnly: true });

    return res.json({
      code: 200,
      success: true,
      message: 'Logout is done!',
    })


  }
  catch(err) {
    return res.json({
      code: 400,
      success: false,
      message: 'Something wrong at refresh token!',
    })
  }

}




