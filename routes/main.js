/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
var router = express.Router();
var Post = require('../models/Post');
const {
  ensureAutheticated,
} = require('../helpers/auth');

//Routes
router.get('/', (req, res) => {
  if(req.user === undefined){
      res.render('index', {
          title: 'Início | Blog Admin',
          layout: 'layouts/layout',
      });
  } else {
    res.redirect('/index');
  }
});

router.get('/index', ensureAutheticated, (req, res) => {
  Post.find({})
    .sort({
      date: 1,
    })
    .then(posts => {
      res.render('dashboard', {
        title: 'Início | Blog Admin',
        layout: 'layouts/layout',
        name: req.user.name,
        posts: posts,
        moment: moment,
      });
    });
});

router.get('/profile', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Área Pessoal | Blog Admin',
    layout: 'layouts/layout',
    name: req.user.name,
  };
  res.render('profile', locals);
});

router.get('/settings', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Configurações | Blog Admin',
    layout: 'layouts/layout',
    name: req.user.name,
  };
  res.render('settings', locals);
});

module.exports = router;
