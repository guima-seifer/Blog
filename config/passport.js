/*jshint esversion: 6 */
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const configAuth = require('./auth');
//load user model
const User = mongoose.model('User');

module.exports = function(passport) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
    },
    (email, password, done) => {
      // console.log(email);
      // console.log(password);
      
      //Match user
      User.findOne({
        email: email,
      }).then(user => {
        if (!user) {
          return done(null, false, {
            message: 'Utilizador não existente',
          });
        }

        //match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: 'Palavra-chave incorreta',
            });
          }
        });
      });
    }));

  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
    },
    function (token, refreshToken, profile, done) {
      // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Google
      process.nextTick(function () {

        // try to find the user based on their google id
        User.findOne({
          'idGoogle': profile.id,
        }, function (err, user) {
          if (err)
            return done(err);

          if (user) {
            // if a user is found, log them in
            return done(null, user);
          } else {
            // if the user isnt in our database, create a new user
            let newUser = new User();

            // set all of the relevant information
            newUser.token = token;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value; // pull the first email
            // save the user
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });

    }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
