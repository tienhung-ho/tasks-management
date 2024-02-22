
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

      const keySecret = process.env.KEYSECRET
      const salt = await bcrypt.genSalt(parseInt(process.env.SALT))
      const hashedPassword = await bcrypt.hash(record.password, salt)
  
      const user = await UserModel.create({
        fullName: record.fullName,
        email: record.email,
        password: hashedPassword
      })

      const token = jwt.sign({ _id: user._id, }, `${keySecret}`)

      user.tokenUser = token
      user.save()

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
      })
  
      res.json({
        code: 200,
        message: 'Created!',
        data: token
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

    const keySecret = process.env.KEYSECRET

    const existUser = await UserModel.findOne({
      email: record.email,
      deleted: false
    })

    if (existUser) {
      const corectUser = await bcrypt.compare(record.password, existUser.password)
      // console.log(corectUser);
      if (corectUser) {
        const token = jwt.sign({ _id: existUser._id, }, `${keySecret}`)

        existUser.tokenUser = token
        existUser.save()



        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000
        })

        res.json({
          code: 200,
          message: 'Logined',
          data: token
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

  const timeExpire = 1

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

// [POST] /api/v1/users/password/forgot
module.exports.otpPassword = async (req, res) => {
  const keySecret = process.env.KEYSECRET

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

  const token = jwt.sign({ _id: user._id, }, `${keySecret}`)

  user.tokenUser = token
  user.save()



  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  })


  res.json({
    code: 200,
    message: 'Xác thực thành công!',
  })

}





