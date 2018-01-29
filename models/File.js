//Created by rafael on 16/01/2018

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let FileSchema = new Schema({
  filename: {
    type: String,
  },
  length: {
    type: Number,
  },
  md5: {
    type: String,
  },
});

module.exports = mongoose.model('File', FileSchema, 'fs.files');
