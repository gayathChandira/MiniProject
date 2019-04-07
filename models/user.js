let mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
//use schema

const userSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
});
const User = (module.exports = mongoose.model('User', userSchema));
