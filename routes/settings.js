/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
var router = express.Router();
const {
  ensureAutheticated,
} = require('../helpers/auth');
let User = require('../models/User');
let Category = require('../models/Category');
let nets = require('nets');

router.get('/', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Configurações | Blog Admin',
    layout: 'layouts/layout',
    name: req.user.name,
    format: req.user.preferFormat,
    registos: req.user.registos,
  };
  res.render('settings', locals);
});

router.post('/save', ensureAutheticated, (req,res) => {
  User.findByIdAndUpdate(req.user._id,{
    preferFormat : req.body.format,
    registos : req.body.registos
  })
      .exec((err,doc) => {
        if(!err){
            res.redirect('/settings');
        }
      });
});

module.exports = router;
