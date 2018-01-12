//Created by rafael on 11/01/2018
const express = require('express');
const moment = require("moment");
let router = express.Router();
let Category = require('../models/Category');
const { ensureAutheticated } = require('../helpers/auth');

router.use(express.static('public'));

router.get('/', ensureAutheticated, (req, res) => {
    Category.find({}, { name:1, date:1,_id:0 })
        .sort({
            date : -1
        }).exec((err, categories) => {
        if(!err){
            let locals = {
                title: 'Home | Blog Admin',
                layout: 'layouts/layout',
                state: 'autenticado',
                categories : categories,
                name : req.user.name,
                moment : moment
            };
            res.render('./categories/categories',locals);
        }
    });

});

router.post('/add',ensureAutheticated,(req,res) => {
    let newCategory = new Category({
        name : req.body.title
    });
    newCategory.save((err,result) => {
        if(!err){
            res.redirect('/index');
        } else {
            console.log(err);
        }
    })
});

module.exports = router;