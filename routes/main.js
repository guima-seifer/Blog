/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
var router = express.Router();
var Post = require('../models/Post');
const {
  ensureAutheticated,
} = require('../helpers/auth');
let User = require('../models/User');
let Category = require('../models/Category');
let nets = require('nets');

//Routes
router.get('/', (req, res) => {
  if (req.user === undefined) {
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
      Category.find({}, {
          name: 1,
          _id: 0,
        })
        .sort({
          name: 1,
        }).exec((err, categories) => {
          if (!err) {
            res.render('dashboard', {
              title: 'Início | Blog Admin',
              layout: 'layouts/layout',
              name: req.user.name,
              posts: posts,
              moment: moment,
              categories: categories,
            });
          }
        });
    });
});

router.get('/profile', ensureAutheticated, (req, res) => {
    Post.find({})
        .sort({
            date: 1,
        })
        .then(posts => {
            User.findOne({
                _id: req.user._id,
            })
                .exec((err, user) => {
                    if (!err) {
                        if (user.avatar !== undefined) {
                            nets({
                                body: '{"avatar": "' + user.avatar + '"}',
                                url: "http://localhost:3334/file/download/",
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                }
                            }, function done(err, resp, body) {
                                if (!err) {
                                    var locals = {
                                        title: 'Área Pessoal | Blog Admin',
                                        layout: 'layouts/layout',
                                        name: req.user.name,
                                        user: user,
                                        posts : posts
                                    };
                                    res.render('personalProfile', locals);
                                } else {
                                    console.log(err);
                                }
                            });
                        } else {
                            var locals = {
                                title: 'Área Pessoal | Blog Admin',
                                layout: 'layouts/layout',
                                name: req.user.name,
                                user: user,
                                posts : posts
                            };
                            res.render('personalProfile', locals);
                        }
                    } else {
                        console.log(err);
                    }
                });
        });
});

router.get('/settings', ensureAutheticated, (req, res) => {
    Post.find({})
        .sort({
            date: 1,
        })
        .then(posts => {
            var locals = {
                title: 'Configurações | Blog Admin',
                layout: 'layouts/layout',
                name: req.user.name,
                posts : posts
            };
            res.render('settings', locals);
        });
});

module.exports = router;
