/*jshint esversion: 6 */
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const { ensureAutheticated } = require('../helpers/auth');
var User = require('../models/User');

router.use(express.static('public'));

router.get('/', ensureAutheticated , (req, res) => {
  var locals = {
    title: 'Utilizadores | Blog Admin',
    layout: 'layouts/layout',
    name : req.user.name,
    state: 'autenticado',
  };
  res.render('./users/users', locals);
});

router.get('/login', (req, res) => {
  var locals = {
    title: 'Iniciar Sessão | Blog Admin',
    layout: 'layouts/layout',
    state: 'null',
  };
  res.render('./users/login', locals);
});

router.get('/register', (req, res) => {
  var locals = {
    title: 'Registar conta | Blog Admin',
    layout: 'layouts/layout',
    state: 'null',
    errors: [],
    name: [],
    email: [],
    password: [],
    password2: [],
  };
  res.render('./users/register', locals);
});

//Logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Sessão terminada');
  res.redirect('/users/login');
});

//Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/index',
    failureRedirect: '/users/login',
    failtureFlash: true,
  })(req, res, next);
});

//Register Form POST
router.post('/register', (req, res) => {
  let errors = [];
  if (req.body.password !== req.body.password2) {
    errors.push({
      text: 'Palavras-chave não correspondem.',
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: 'Palavra-chave tem de ter mais que 4 caractéres.',
    });
  }

  if (errors.length > 0) {
    res.render('./users/register', {
      title: 'Registar conta | Blog Admin',
      layout: 'layouts/layout',
      state: 'null',
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    });
  } else {
    User.findOne({
      email: req.body.email,
    }).then(user => {
      if (user) {
        req.flash('error_msg', 'Email já registado');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                req.flash('success_msg', 'Conta registada, pode iniciar a sessão');
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

//GOOGLE
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/google/callback',
    passport.authenticate('google', {
        successRedirect : '/index',
        failureRedirect : '/users/login'
    }));

module.exports = router;
