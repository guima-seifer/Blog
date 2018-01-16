//Created by rafael on 11/01/2018
/*jshint esversion: 6 */

const express = require('express');
const moment = require('moment');
let router = express.Router();
let Category = require('../models/Category');
const {
  ensureAutheticated,
} = require('../helpers/auth');

router.use(express.static('public'));

router.get('/', ensureAutheticated, (req, res) => {
  Category.find({}, {
      name: 1,
      date: 1,
      _id: 1,
    })
    .sort({
      date: -1,
    }).exec((err, categories) => {
      if (!err) {
        let locals = {
          title: 'Categorias | Blog Admin',
          layout: 'layouts/layout',
          categories: categories,
          name: req.user.name,
          moment: moment,
        };
        res.render('./categories/categories', locals);
      }
    });

});

router.post('/add', ensureAutheticated, (req, res) => {
  let newCategory = new Category({
    name: req.body.title,
  });
  newCategory.save((err, result) => {
    if (!err) {
      req.flash('success_msg', 'Categoria adicionada');
      res.redirect('/categories');
    } else {
      req.flash('error_msg', 'Erro a adicionar categoria');
      console.log(err);
    }
  });
});

//delete post process
router.delete('/delete/:id', ensureAutheticated, (req, res) => {
  Category.remove({
      _id: req.params.id,
    })
    .then(() => {
      req.flash('success_msg', 'Categoria eliminada com suceso');
      res.redirect('/categories');
    });
});

module.exports = router;
