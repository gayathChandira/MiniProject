const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const gravatar = require('gravatar');
const database = require('../config/database');
const jwt = require('jsonwebtoken');

//bring user model
let User = require('../models/user');

//register process
router.post('/register', function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'UserName is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req
    .checkBody('password2', 'Passwords do not match')
    .equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    res.json({
      errors: errors
    });
  } else {
    User.findOne({ username: req.body.username }).then(user => {
      if (user) {
        return res.status(400).json({ username: 'Username already exists' });
      } else {
        var avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        //console.log(avatar);
        let newUser = new User({
          name: name,
          email: email,
          username: username,
          password: password,
          avatar: avatar
        });
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(newUser.password, salt, function(err, hash) {
            if (err) {
              console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err) {
              if (err) {
                console.log(err);
                return;
              } else {
                res.json({ message: 'successfully Registered!' });
              }
            });
          });
        });
      }
    });
  }
});

//login
router.post('/login', function(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(user.toJSON(), database.secret, {
        expiresIn: '1h'
      });
      return res.json({ user, token });
    });
  })(req, res);
});

//get user by id
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.json({ message: 'User Found', user: user });
    }
  });
});

//logout process
router.post('/logout', function(req, res) {
  req.logout();
  res.json({ message: 'successfully logged out' });
});
module.exports = router;
