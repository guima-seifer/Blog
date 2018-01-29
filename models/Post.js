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

  // ISTO TEM QUE SUMIR
  author: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  status: {
    type: String,
    default: 'public',
  },
  allowComments: {
    type: String,
  },

  comments: [{
    commentBody: {
      type: String,
    },
    commentDate: {
      type: Date,
      default: Date.now,
    },
    commentUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  }, ],

  frontComments : [{
    name : {type: String},
    email : {type: String},
    date : {type : Date, default : Date.now},
    commentBody : {type: String}
  }],

  url_name : {type: String},

  files: [{
    type: String,
  }, ],
});

//export model, compila o Schema para o modelo que atribui o nome de partitura - nome do modelo
module.exports = mongoose.model('Post', PostSchema, 'posts');
