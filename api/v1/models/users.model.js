const mongoose = require('mongoose')
const generate = require('../../../helpers/genarate');

const usersSchema = new mongoose.Schema(
{
  fullName: String, 
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default: generate.generateRandomString(30)
  },
  phone: String,
  avatar: String,
  status: {
    type: String,
    default: 'active'
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
{ timestamps: true })

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
