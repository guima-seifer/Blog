/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PostSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  bio: { type: String, required: false },
  avatar: { type: String, required: false },

});

//export model, compila o Schema para o modelo que atribui o nome de partitura - nome do modelo
module.exports = mongoose.model('User', PostSchema);
