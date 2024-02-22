const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String, 
    otp: String,
    expireAt: {
      type: Date,
      expires: 60
    }
  },
  { timestamps: true }
)

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

module.exports = ForgotPassword;
