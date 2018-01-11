/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PostSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String, required: true },
});

//export model, compila o Schema para o modelo que atribui o nome de partitura - nome do modelo
module.exports = mongoose.model('Post', PostSchema, 'posts');
