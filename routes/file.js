//Created by rafael on 16/01/2018
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let formidable = require('formidable');
let grid = require("gridfs-stream");
let fs = require('fs');
let conn = mongoose.connection;
let User = require('../models/User');
let File = require('../models/File');

router.post('/upload',function (req,res) {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        grid.mongo = mongoose.mongo;
        let gfs = grid(conn.db);
        let writestream = gfs.createWriteStream({
            filename: files.avatar.name
        });
        fs.createReadStream(files.avatar.path).pipe(writestream).on('close', function () {
            User.findOneAndUpdate({_id : req.user._id}, {avatar : files.avatar.name}, (err,doc) => {
                if(!err){
                    res.redirect('/profile');
                } else {
                    console.log(err);
                }
            });
        });
    });
});

router.post('/attached/:nameFile', (req,res) => {
    let name = req.params.nameFile;
    File.findOne({filename : name})
        .exec((err,fich) => {
            if (!err && fich !== null) {
                grid.mongo = mongoose.mongo;
                let gfs = grid(conn.db);
                let fs_write_stream = fs.createWriteStream(__dirname + '/../public/files/' + fich.filename);
                let readstream = gfs.createReadStream({
                    filename: name
                });

                readstream.pipe(fs_write_stream);
                fs_write_stream.on('close', function () {
                    setTimeout(() => {
                        fs.unlink(__dirname + '/../public/files/' + fich.filename, function (err,resultUnlink) {
                            if(err){
                                console.log("Erro no unlink: "+err);
                            }
                        });
                    }, 5500);
                    res.download(__dirname + '/../public/files/' + fich.filename);
                });
            }
        });
});

router.post('/download/',(req,res,next) => {
    if(req.body.avatar !== undefined && req.body.avatar !== ''){
        File.findOne({filename : req.body.avatar})
            .exec((err,fich) => {
                if(!err && fich !== null){
                    grid.mongo = mongoose.mongo;
                    let gfs = grid(conn.db);
                    let fs_write_stream = fs.createWriteStream(__dirname+'/../public/img/'+fich.filename);
                    let readstream = gfs.createReadStream({
                        filename : req.body.avatar
                    });

                    readstream.pipe(fs_write_stream);
                    fs_write_stream.on('close', function () {
                        next()
                    });

                } else {
                    console.log("Erro: "+err);
                }
            });
    }
});

module.exports = router;