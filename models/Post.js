/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  comments: [{
    commentBody: {
      type: String,
      required: true,
    },
    commentDate: {
      type: Date,
      default: Date.now(),
    },
    commentUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },]
});

//export model, compila o Schema para o modelo que atribui o nome de partitura - nome do modelo
module.exports = mongoose.model('Post', PostSchema, 'posts');
