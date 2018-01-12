/*jshint esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const ejs = require('ejs');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const app = express();

//Load routes
const posts = require('./routes/posts');
const others = require('./routes/main');
const users = require('./routes/users');
const category = require('./routes/category');

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

//Base Dados
mongoose.Promise = global.Promise; //Map global promise - get rid of warning
//connect to mongoose
mongoose.connect(db.mongoURI, {
    useMongoClient: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//MIDDLEWARE
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({
  extended: true,
})); //parse application/x-www-form-urlencoded
app.use(bodyParser.json()); //parse apllication/json
app.use(methodOverride('_method')); //Method override middleware

// express session middleware
app.use(cookieParser('cat'));
app.use(session({
  secret: 'cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2*24*60*60*1000, //Login para 1 dia
  },
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;

  // console.log("res.locals.error app.js");
  // console.log(res.locals);
  next();
});

app.use(cors());

// view engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/', others);
app.use('/posts', posts);
app.use('/posts/details', posts);
app.use('/users', users);
app.use('/users/login', users);
app.use('/auth',users);
app.use('/categories',category);

// uncomment after placing your favicon in /public
//TODO: favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const port = process.env.PORT || 3334; //heroku port

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
module.exports = app;
