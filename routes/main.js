/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
var router = express.Router();
var Post = require('../models/Post');
const {
  ensureAutheticated,
} = require('../helpers/auth');
let Category = require('../models/Category');
let nets = require('nets');

router.get('/', ensureAutheticated, (req, res) => {
  Post.find({})
    .sort({
      date: 1,
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(posts => {
      Category.find({}, {
          name: 1,
          _id: 0,
        })
        .sort({
          name: 1,
        }).exec((err, categories) => {
          if (!err) {
            if (req.user.avatar !== undefined && req.user.avatar !== '') {
              nets({
                body: '{"avatar": "' + req.user.avatar + '"}',
                url: "http://localhost:3334/file/download/",
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
              }, function done(err, resp, body) {
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
            } else {
              res.render('dashboard', {
                title: 'Início | Blog Admin',
                layout: 'layouts/layout',
                name: req.user.name,
                posts: posts,
                moment: moment,
                categories: categories,
              });
            }
          }
        });
    });
});

module.exports = router;
