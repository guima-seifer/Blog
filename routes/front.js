/*jshint esversion: 6 */

//Created by rafael on 29/01/2018
const express = require('express');
const moment = require('moment');
const path = require('path');
let _und = require('underscore');
let router = express.Router();
let mongoose = require('mongoose');
let Post = require('../models/Post');
let Category = require('../models/Category');

router.use(express.static('public'));

router.get('/', (req, res) => {
        Post.find({status:'public'})
          .populate('user')
          .sort({date:-1})
          .exec((err, posts) => {
            if (!err) {
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
            } else {
              console.log("Erro: " + err);
            }
          });
});

router.get('/post/:idPost',(req,res) => {
    let id = req.params.idPost;
    if(id)
    Post.findOne({url_title : id})
        .populate('user')
        .exec((err,post) => {
            if(!err){
                let locals = {
                    layout: 'layouts/frontLayout',
                    categories : post.category,
                    post : post,
                    moment : moment,
                    isIndex : '2'
                };
                res.render('./front/post', locals);
            } else {
                console.log("Erro: "+err);
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
