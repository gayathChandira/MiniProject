const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('./database');

//local strategy
passport.use(
  new LocalStrategy(function(username, password, done) {
    //match username
    let query = { username: username };
    User.findOne(query, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: 'User Not found!' });
      }

      //match password
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          // User matched

          return done(null, user, { message: 'Logged in Successfully!' });
        } else {
          return done(null, false, { message: 'Incorrect Password' });
        }
      });
    });
  })
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: database.secret
    },
    function(jwtPayload, cb) {
      return User.findById(jwtPayload._id)
        .then(user => {
          return cb(null, user);
        })
        .catch(err => {
          return cb(err);
        });
    }
  )
);
