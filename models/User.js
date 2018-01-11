/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String},
  date: { type: Date, default: Date.now },
  token :{ type: String},
  idGoogle :{ type: String}
});

//export model, compila o Schema para o modelo que atribui o nome de partitura - nome do modelo
module.exports = mongoose.model('User', UserSchema, 'users');
