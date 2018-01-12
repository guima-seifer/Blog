//Created by rafael on 11/01/2018

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const CategorySchema = new Schema({
    name : { type: String, required: true },
    date : { type: Date, default: Date.now }
});

//export model, compila o Schema para o modelo que atribui o nome de partitura - nome do modelo
module.exports = mongoose.model('Category', CategorySchema, 'categories');
