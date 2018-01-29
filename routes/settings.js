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
  };
  res.render('settings', locals);
});

module.exports = router;
