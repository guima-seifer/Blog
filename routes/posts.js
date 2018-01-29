/*jshint esversion: 6 */
const express = require('express');
const moment = require('moment');
const path = require('path');
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
      "'files'": {
        $gt: ' ',
      },
    }, {
      _id: 0,
      "'files'": 1,
    })
    .exec((err, docs) => {

    });
  Post.find({
      author: req.user.id,
    })
    .populate('user')
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
router.get('/:idPost', ensureAutheticated, (req, res) => {
  Post.findOne({
      _id: req.params.idPost,
    })
    .populate('user')
    .populate('comments.commentUser')
    .then(post => {
      Category.find({}, {
          name: 1,
          _id: 0,
        })
        .sort({
          name: 1,
        }).exec((err, categories) => {
          if (!err) {
            if (post.user._id.toString() !== req.user._id.toString()) {
              if (post.allowComments === 'on') {
                res.render('./posts/postview', {
                  title: post.title + '| Blog Admin',
                  layout: 'layouts/layout',
                  name: req.user.name,
                  user: req.user,
                  moment: moment,
                  categories: categories,
                  post: post,
                });
              } else {
                req.flash('error_msg', 'Oops, este post não permite comentários.');
                res.redirect('/posts');
              }
            } else {
              if (req.query.edit === '') {
                res.render('./posts/details', {
                  title: post.title + '| Blog Admin',
                  layout: 'layouts/layout',
                  name: req.user.name,
                  user: req.user,
                  moment: moment,
                  categories: categories,
                  post: post,
                });
              } else {
                res.render('./posts/postview', {
                  title: post.title + '| Blog Admin',
                  layout: 'layouts/layout',
                  name: req.user.name,
                  user: req.user,
                  moment: moment,
                  categories: categories,
                  post: post,
                });
              }
            }
          } else {
            console.log('Erro: ' + err);
          }
        });
    });
});

router.post('/add', ensureAutheticated, (req, res) => {
  let form = new formidable.IncomingForm();
  form.multiples = true;

  form.parse(req, (err, fields, files) => {
    let errors = [];
    let categories = [];

    if (!fields.title) {
      errors.push({
        text: 'Insira o título à postagem',
      });
    }

    if (!fields.pill0) {
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
      req.flash('error_msg', errors);
      res.redirect('/posts');
    } else {
      //nenhum ficheiro anexado
        let keys = Object.keys(fields);
        for(let i = 0; i < keys.length; i++){
            if(keys[i].indexOf('pill') !== -1){
                categories.push(fields[keys[i]]);
            }
        }
      if (files.filetoupload.length === undefined && files.filetoupload.name === '') {
        const User = {};
        new Post();
        const newPost = {
          title: fields.title,
          category: categories,
          body: fields.textarea,
          authorName: req.user.name,
          user: req.user._id,
          url_title : slug(fields.title)
        };
          Post.findOne({url_title : newPost.url_title})
              .exec((err,document) => {
                  if(document === null){
                      new Post(newPost)
                          .save()
                          .then(post => {
                              req.flash('success_msg', 'Postagem adicionada com sucesso');
                              res.redirect('/posts');
                          });
                  } else {
                      newPost.url_title = newPost.url_title+'-2';
                      new Post(newPost)
                          .save()
                          .then(post => {
                              req.flash('success_msg', 'Postagem adicionada com sucesso');
                              res.redirect('/posts');
                          });
                  }
              })

        //um ficheiro para ser anexado
      } else if (files.filetoupload.length === undefined && files.filetoupload.name !== '') {
        grid.mongo = mongoose.mongo;
        let gfs = grid(conn.db);
        let writestream = gfs.createWriteStream({
          filename: files.filetoupload.name,
        });

          let keys = Object.keys(fields);
          for(let i = 0; i < keys.length; i++){
              if(keys[i].indexOf('pill') !== -1){
                  categories.push(fields[keys[i]]);
              }
          }

        fs.createReadStream(files.filetoupload.path).pipe(writestream).on('close', function() {
          const User = {};
          new Post();
          let file = [];
          file.push(files.filetoupload.name);
          const newPost = {
            title: fields.title,
            category: categories,
            body: fields.textarea,
            authorName: req.user.name,
            files: file,
            user : req.user._id,
            url_title : slug(fields.title)
          };
            Post.findOne({url_title : newPost.url_title})
                .exec((err,document) => {
                    if(document === null){
                        new Post(newPost)
                            .save()
                            .then(post => {
                                req.flash('success_msg', 'Postagem adicionada com sucesso');
                                res.redirect('/posts');
                            });
                    } else {
                        newPost.url_title = newPost.url_title+'-2';
                        new Post(newPost)
                            .save()
                            .then(post => {
                                req.flash('success_msg', 'Postagem adicionada com sucesso');
                                res.redirect('/posts');
                            });
                    }
                })
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

          let keys = Object.keys(fields);
          for(let i = 0; i < keys.length; i++){
              if(keys[i].indexOf('pill') !== -1){
                  categories.push(fields[keys[i]]);
              }
          }

        const User = {};
        new Post();
        const newPost = {
          title: fields.title,
          category: categories,
          body: fields.textarea,
          user: req.user._id,
          authorName: req.user.name,
          files: ficheiros,
          url_title: slug(fields.title)
        };

        Post.findOne({url_title : newPost.url_title})
            .exec((err,document) => {
              if(document === null){
                  new Post(newPost)
                      .save()
                      .then(post => {
                          req.flash('success_msg', 'Postagem adicionada com sucesso');
                          res.redirect('/posts');
                      });
              } else {
                  newPost.url_title = newPost.url_title+'-2';
                  new Post(newPost)
                      .save()
                      .then(post => {
                          req.flash('success_msg', 'Postagem adicionada com sucesso');
                          res.redirect('/posts');
                      });
              }
            })
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
      post.user = req.user._id;
      post.allowComments = req.body.checkComments;
      post.save().then(post => {
        req.flash('success_msg', 'Postagem editada com sucesso');
        res.redirect('/posts');
      });
    });
});

//Add comment
router.post('/comment/:idPost', ensureAutheticated, (req, res, err) => {
  Post.findOne({
      _id: req.params.idPost,
    })
    .then(post => {
      const newComment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id,
      };
      console.log(newComment);

      //push to comments array
      //falta por o unshift
      post.comments.unshift(newComment); //add to the begining of the array
      post.save()
        .then(post => {
          res.redirect('/posts/' + post.id);
        }).catch(() => {
          req.flash('error_msg', 'Oops, não estás autorizado');
          res.redirect('/posts');
        });
    });
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

module.exports = router;
