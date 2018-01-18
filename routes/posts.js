/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
let router = express.Router();
let Post = require('../models/Post');
let Category = require('../models/Category');
const {
  ensureAutheticated,
} = require('../helpers/auth');

//novas cenas?
let formidable = require('formidable');
let mongoose = require('mongoose');
let grid = require('gridfs-stream');
let fs = require('fs');
let conn = mongoose.connection;

router.use(express.static('public'));

router.get('/', ensureAutheticated, (req, res) => { //falta sacar os ficheiros de cada 1
  Post.find({
      'files': {
        $gt: ' ',
      },
    }, {
      _id: 0,
      "files": 1,
    })
    .exec((err, docs) => {

    });

  Post.find({
      author: req.user.id,
    })
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
            res.render('./posts/posts', {
              title: 'Postagens | Blog Admin',
              layout: 'layouts/layout',
              posts: posts,
              name: req.user.name,
              moment: moment,
              categories: categories,
            });
          }
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
router.get('/edit/:idPost', ensureAutheticated, (req, res) => {
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

/* TODO: Create conditions for a certain user to be able to edit another user post */
router.get('/:idPost', ensureAutheticated, (req, res) => {
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
            if (!err) {
              res.render('./posts/details', {
                title: post.title + '| Blog Admin',
                layout: 'layouts/layout',
                name: req.user.name,
                state: 'autenticado',
                categories: categories,
                post: post,
              });
            }
          });
      }
    });
});

router.post('/add', ensureAutheticated, (req, res) => {
  let form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    let errors = [];
    if (!fields.title) {
      errors.push({
        text: 'Insira o título à postagem',
      });
    }

    if (!fields.category) {
      errors.push({
        text: 'Associe uma categoria à sua postagem',
      });
    }

    if (!fields.textarea) {
      errors.push({
        text: 'Insira algum conteúdo à postagem',
      });
    }

    if (errors.length > 0) {
      var locals = {
        title: 'Adicionar Postagem | Blog Admin',
        layout: 'layouts/layout',
        errors: errors,
        postTitle: fields.title,
        postCategory: fields.category,
        postBody: fields.textarea,
        author: req.user.id,
        authorName: req.user.name,
        allowComments: fields.checkComments,
      };
      res.render('./posts/addpost', locals);
    } else {
      //nenhum ficheiro anexado
      if (files.filetoupload.length === undefined && files.filetoupload.name === '') {
        const User = {};
        new Post();
        const newPost = {
          title: fields.title,
          category: fields.category,
          body: fields.textarea,
          author: req.user.id,
          authorName: req.user.name,
        };
        new Post(newPost)
          .save()
          .then(post => {
            req.flash('success_msg', 'Postagem adicionada com sucesso');
            res.redirect('/posts');
          });

        //um ficheiro para ser anexado
      } else if (files.filetoupload.length === undefined && files.filetoupload.name !== '') {
        grid.mongo = mongoose.mongo;
        let gfs = grid(conn.db);
        let writestream = gfs.createWriteStream({
          filename: files.filetoupload.name,
        });

        fs.createReadStream(files.filetoupload.path).pipe(writestream).on('close', function() {
          const User = {};
          new Post();
          let file = [];
          file.push(files.filetoupload.name);
          const newPost = {
            title: fields.title,
            category: fields.category,
            body: fields.textarea,
            author: req.user.id,
            authorName: req.user.name,
            files: file,
            s
          };
          new Post(newPost)
            .save()
            .then(post => {
              req.flash('success_msg', 'Postagem adicionada com sucesso');
              res.redirect('/posts');
            });
        });
      } else { //múltiplos ficheiros para serem anexados
        grid.mongo = mongoose.mongo;
        let gfs = grid(conn.db);
        let ficheiros = [];

        for (let j = 0; j < files.filetoupload.length; j++) {
          let writestream = gfs.createWriteStream({
            filename: files.filetoupload[j].name,
          });
          ficheiros.push(files.filetoupload[j].name);
          fs.createReadStream(files.filetoupload[j].path).pipe(writestream);
        }

        const User = {};
        new Post();
        const newPost = {
          title: fields.title,
          category: fields.category,
          body: fields.textarea,
          author: req.user.id,
          authorName: req.user.name,
          files: ficheiros,
        };
        new Post(newPost)
          .save()
          .then(post => {
            req.flash('success_msg', 'Postagem adicionada com sucesso');
            res.redirect('/posts');
          });
      }
    }
  });

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
