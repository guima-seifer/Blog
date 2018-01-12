/*jshint esversion: 6 */
const express = require('express');
var router = express.Router();
var Post = require('../models/Post');
const {
  ensureAutheticated,
} = require('../helpers/auth');

//Routes
router.get('/', (req, res) => {

  res.render('index', {
    title: 'Início | Blog Admin',
    layout: 'layouts/layout',
    state: 'autenticado',
  });
});

router.get('/index', ensureAutheticated, (req, res) => {
  console.log(req.user);
  Post.find({
      author: req.user.id,
    })
    .sort({
      date: 1,
    })
    .then(posts => {
      res.render('dashboard', {
        title: 'Início | Blog Admin',
        layout: 'layouts/layout',
        posts: posts,
      });
    });
});

router.get('/categories', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Home | Blog Admin',
    layout: 'layouts/layout',
  };
  res.render('./categories/categories', locals);
});

router.get('/profile', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Área Pessoal | Blog Admin',
    layout: 'layouts/layout',
  };
  res.render('profile', locals);
});

router.get('/settings', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Configurações | Blog Admin',
    layout: 'layouts/layout',
  };
  res.render('settings', locals);
});

//Routes
router.get('/', ensureAutheticated, (req, res) => {
  Post.find({
      author: req.user.id,
    })
    .sort({
      date: 'desc',
    })
    .then(posts => {
      res.render('index', {
        title: 'Início | Blog Admin',
        layout: 'layouts/layout',
        posts: posts,
      });
    });
});

router.get('/index', ensureAutheticated, (req, res) => {
  Post.find({
      author: req.user.id,
    })
    .sort({
      date: 1,
    })
    .then(posts => {
      res.render('index', {
        title: 'Início | Blog Admin',
        layout: 'layouts/layout',
        posts: posts,
      });
    });
});

router.get('/categories', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Home | Blog Admin',
    layout: 'layouts/layout',
  };
  res.render('./categories/categories', locals);
});

router.get('/profile', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Área Pessoal | Blog Admin',
    layout: 'layouts/layout',
  };
  res.render('profile', locals);
});

router.get('/settings', ensureAutheticated, (req, res) => {
  var locals = {
    title: 'Configurações | Blog Admin',
    layout: 'layouts/layout',
  };
  res.render('settings', locals);
});

module.exports = router;
