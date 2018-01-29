/*jshint esversion: 6 */

//Created by rafael on 29/01/2018
const express = require('express');
const moment = require('moment');
const path = require('path');
let router = express.Router();
let mongoose = require('mongoose');
let Post = require('../models/Post');
let Category = require('../models/Category');

router.use(express.static('public'));

router.get('/', (req, res) => {
  Category.find({})
    .exec((err, categories) => {
      if (!err) {
        Post.find({})
          .populate('user')
          .exec((err, posts) => {
            if (!err) {
              let locals = {
                layout: 'layouts/frontLayout',
                categories: categories,
                posts: posts,
                moment: moment,
                isIndex: '1',
              };
              res.render('./front/index', locals);
            } else {
              console.log("Erro: " + err);
            }
          })
      } else {
        console.log("Erro : " + err);
      }
    })
});

router.get('/post/:idPost',(req,res) => {
    let id = req.params.idPost;
    Category.find({})
        .exec((err,categories) => {
            if(!err){
                Post.findOne({_id : mongoose.Types.ObjectId(id.toString())})
                    .populate('user')
                    .exec((err,post) => {
                        if(!err){
                            let locals = {
                                layout: 'layouts/frontLayout',
                                categories : categories,
                                post : post,
                                moment : moment,
                                isIndex : '2'
                            };
                            res.render('./front/post', locals);
                        } else {
                            console.log("Erro: "+err);
                        }
                    })
            } else {

      }
    });
});

/** MÉTODOS POST */
router.post('/post/:id', (req,res) => {
    let id = req.params.id;
    let newComment = {
        name : req.body.nome,
        email : req.body.mail,
        commentBody : req.body.comentario,
        date : new Date()
    };

  Post.findOne({
      _id: mongoose.Types.ObjectId(id.toString())
    })
    .exec((err, post) => {
      if (!err) {
        post.frontComments.push(newComment);
        post.save(saved => {
          res.redirect('/post/' + post._id);
        })
      } else {
        console.log("Erro: " + err);
      }
    });
});

module.exports = router;
