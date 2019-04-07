let mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;
//post Schema
let postSchema = new Schema(
  {
    _id: {
      type: String,
      default: shortid.generate
    },
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    categoryID: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

let Post = (module.exports = mongoose.model('Post', postSchema));
