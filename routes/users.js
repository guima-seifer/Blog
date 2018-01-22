/*jshint esversion: 6 */
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {
  ensureAutheticated,
} = require('../helpers/auth');
let User = require('../models/User');
let Post = require('../models/Post');
const moment = require('moment');
let nets = require('nets');

router.use(express.static('public'));

router.get('/', ensureAutheticated, (req, res) => {
  User.find({}, {
      name: 1,
      email: 1,
      date: 1,
      url_name: 1,
    })
    .sort({
      date: -1,
    })
    .then(users => {
      Post.find({
          author: req.user.id,
        })
        .exec((err, posts) => {
          if (!err) {
            console.log(posts.length);
            console.log(posts);
            var locals = {
              title: 'Utilizadores | Blog Admin',
              layout: 'layouts/layout',
              name: req.user.name,
              users: users,
              moment: moment,
              postsSize: posts.length,
            };
            res.render('./users/users', locals);
          } else {
            console.log(err);
          }
        });
    });
});

router.get('/login', (req, res) => {
  var locals = {
    title: 'Iniciar Sessão | Blog Admin',
    layout: 'layouts/layout',
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
          url_name: slug(req.body.name)
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
              });
          });
        });
      }
    });
  }
});

//GOOGLE
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// the callback after google has authenticated the user
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/index',
  failureRedirect: '/users/login',
}));

//Informação de um utilizador, sem ser na Área Pessoal
router.get('/:name', (req, res) => {
    User.findOne({
        url_name : req.params.name,
    })
        .exec((err, userDoc) => {
            if (!err) {
                if (userDoc.avatar !== undefined && userDoc.avatar !== '') {
                    nets({
                        body: '{"avatar": "' + userDoc.avatar + '"}',
                        url: "http://localhost:3334/file/download/",
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }, function done(err, resp, body) {
                        if (!err) {
                            var locals = {
                                title: 'Perfil | Blog Admin',
                                layout: 'layouts/layout',
                                name: req.user.name,
                                user: userDoc
                            };
                            res.render('./users/profile', locals);
                        } else {
                            console.log(err);
                        }
                    });
                } else {
                    var locals = {
                        title: 'Área Pessoal | Blog Admin',
                        layout: 'layouts/layout',
                        name: req.user.name,
                        user: userDoc
                    };
                    res.render('./users/profile', locals);
                }
            } else {
                console.log(err);
            }
        });
});

//Atualizar um user
router.post('/update/:id', (req, res) => {
  User.findOneAndUpdate({
    _id: req.params.id
  }, req.body, (err, doc) => {
    if (!err) {
      res.redirect('/');
    } else {
      console.log(err);
    }
  })
});

let slug = function(str) {
  str = str.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();

  let from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
  let to = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  return str;
};

String.prototype.deentitize = function() {
  let ret = this.replace(/&gt;/g, '>');
  ret = ret.replace(/&lt;/g, '<');
  ret = ret.replace(/&quot;/g, '"');
  ret = ret.replace(/&apos;/g, "'");
  ret = ret.replace(/&amp;/g, '&');
  return ret;
};

module.exports = router;
