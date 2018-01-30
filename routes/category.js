//Created by rafael on 11/01/2018
/*jshint esversion: 6 */

const express = require('express');
const moment = require('moment');
let router = express.Router();
let _und = require('underscore');
let Category = require('../models/Category');
let Post = require('../models/Post');
const {
  ensureAutheticated,
} = require('../helpers/auth');

router.use(express.static('public'));

router.get('/', ensureAutheticated, (req, res) => {
    Post.find({})
        .sort({
            date: 1,
        })
        .then(posts => {
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
                        posts : posts
                    };
                    res.render('./categories/categories', locals);
                }
            });
        });
});

router.get('/:categoria', (req,res) => {
    let categoria = req.params.categoria;
    Post.find({category : categoria})
        .populate('user')
        .sort({date:-1})
        .then(posts => {
            let categories = [];
            let newCategories = [];
            for(let i = 0; i < posts.length; i++){
                categories.push(posts[i].category)
            }

            for(let i = 0; i < categories.length; i++){
                if(categories[i].length !== 1){
                    for(let j=0; j < categories[i].length; j++){
                        newCategories.push(categories[i][j]);
                    }
                } else {
                    newCategories.push(categories[i]);
                }
            }

            let aux = _und.union(newCategories);
            aux = _und.uniq(newCategories);
            aux = _und.flatten(aux);
            aux = _und.uniq(aux);

            let locals = {
                layout: 'layouts/frontLayout',
                categories: aux,
                posts: posts,
                moment: moment,
                isIndex: '1',
            };
            res.render('./front/index', locals);
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
