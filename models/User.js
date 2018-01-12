/*jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String},
  date: { type: Date, default: Date.now },
<<<<<<< HEAD
  bio: { type: String, required: false },
  avatar: { type: String, required: false },

=======
  token :{ type: String},
  idGoogle :{ type: String}
>>>>>>> 570a5be63cc43bb4e1b357bb4730c78793f66687
});

//export model, compila o Schema para o modelo que atribui o nome de partitura - nome do modelo
module.exports = mongoose.model('User', UserSchema, 'users');
