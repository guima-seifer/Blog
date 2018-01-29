/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
var router = express.Router();
const {
  ensureAutheticated,
} = require('../helpers/auth');
let User = require('../models/User');
let nets = require('nets');

router.get('/', ensureAutheticated, (req, res) => {
  User.findOne({
      _id: req.user._id,
    })
    .exec((err, user) => {
      if (!err) {
        if (user.avatar !== undefined && user.avatar !== '') {
          nets({
            body: '{"avatar": "' + user.avatar + '"}',
            url: "http://localhost:3334/file/download/",
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }, function done(err, resp, body) {
            if (!err) {
              var locals = {
                title: 'Área Pessoal | Blog Admin',
                layout: 'layouts/layout',
                name: req.user.name,
                user: user,
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
          };
          res.render('personalProfile', locals);
        }
      } else {
        console.log(err);
      }
    });
});

module.exports = router;
