/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
let router = express.Router();
let Post = require('../models/Post');
let Category = require('../models/Category');
const {
  ensureAutheticated,
} = require('../helpers/auth');

router.use(express.static('public'));

router.get('/', ensureAutheticated, (req, res) => {
  Post.find({
      author: req.user.id,
    })
    .sort({
      date: 1,
    })
    .then(posts => {
      res.render('./posts/posts', {
        title: 'Postagens | Blog Admin',
        layout: 'layouts/layout',
        posts: posts,
        name: req.user.name,
        moment: moment,
      });
    });
});

// Add Post Form
router.get('/add', ensureAutheticated, (req, res) => {
  Category.find({}, {
      name: 1,
      _id: 0,
    })
    .sort({
      name: 1,
    }).exec((err, categories) => {
      if (!err) {
        res.render('./posts/addpost', {
          title: 'Adicionar Postagem | Blog Admin',
          layout: 'layouts/layout',
          state: 'autenticado',
          errors: [],
          name: req.user.name,
          postTitle: [],
          postCategory: [],
          postBody: [],
          categories: categories,
        });
      }
    });

});

/* TODO: Create conditions for a certain user to be able to edit another user post */
router.get('/details/:idPost', ensureAutheticated, (req, res) => {
  Post.findOne({
      _id: req.params.idPost,
    })
    .then(post => {
      if (post.author != req.user.id) {
        req.flash('error_msg', 'Oops, não estás autorizado');
        res.redirect('/posts');
      } else {
        Category.find({}, {
            name: 1,
            _id: 0,
          })
          .sort({
            name: 1,
          }).exec((err, categories) => {
            res.render('./posts/details', {
              title: 'Detalhes de ' + post.title + '| Blog Admin',
              layout: 'layouts/layout',
              name: req.user.name,
              state: 'autenticado',
              post: post,
              categories: categories,
            });
          });
      }
    });
});

router.post('/add', ensureAutheticated, (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: 'Insira o título à postagem',
    });
  }

  if (!req.body.category) {
    errors.push({
      text: 'Associe uma categoria à sua postagem',
    });
  }

  if (!req.body.textarea) {
    errors.push({
      text: 'Insira algum conteúdo à postagem',
    });
  }

  if (errors.length > 0) {
    var locals = {
      title: 'Adicionar Postagem | Blog Admin',
      layout: 'layouts/layout',
      errors: errors,
      postTitle: req.body.title,
      postCategory: req.body.category,
      postBody: req.body.textarea,
      author: req.user.id,
      authorName: req.user.name,
      allowComments: req.body.checkComments,
    };
    res.render('./posts/addpost', locals);
  } else {
    const User = {};
    new Post();
    const newUser = {
      title: req.body.title,
      category: req.body.category,
      body: req.body.textarea,
      author: req.user.id,
      authorName: req.user.name,
    };
    new Post(newUser)
      .save()
      .then(post => {
        req.flash('success_msg', 'Postagem adicionada com sucesso');
        res.redirect('/posts');
      });
  }
});

//delete post process
router.delete('/details/:idPost', ensureAutheticated, (req, res) => {
  Post.remove({
      _id: req.params.idPost,
    })
    .then(() => {
      req.flash('success_msg', 'Postagem eliminada com suceso');
      res.redirect('/posts');
    });
});

//Edit Form Process
router.put('/details/:idPost', ensureAutheticated, (req, res) => {
  Post.findOne({
      _id: req.params.idPost,
    })
    .then(post => {
      //new values
      post.title = req.body.title;
      post.category = req.body.category;
      post.body = req.body.textarea;
      post.author = req.user.id;
      post.allowComments = req.body.checkComments;
      post.save().then(post => {
        req.flash('success_msg', 'Postagem editada com sucesso');
        res.redirect('/posts');
      });
    });
});

module.exports = router;
