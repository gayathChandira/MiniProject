const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//bring models
let Post = require('../models/post');
let User = require('../models/user');

//add submit POST route
router.post('/add', verifyToken, function(req, res) {
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();
  req.checkBody('categoryID', 'categoryID is required').notEmpty();
  jwt.verify(req.token, 'yoursecret', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      let errors = req.validationErrors();

      if (errors) {
        res.json({
          errors: errors
        });
      } else {
        let post = new Post();
        post.title = req.body.title;
        post.author = req.user._id;
        post.content = req.body.content;
        post.categoryID = req.body.categoryID;

        post.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            res.json({
              message: 'Successfully submit a post',
              authData: authData
            });
          }
        });
      }
    }
  });
});

//verify token
function verifyToken(req, res, next) {
  //get auth header value
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    //get token
    const bearer = bearerHeader.split(' ')[1];
    //set token
    req.token = bearer;
    next();
  } else {
    //forbidden
    res.sendStatus(403);
  }
}

//get single article
router.get('/:id', function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    User.findById(post.author, function(err, user) {
      res.json({
        post: post,
        author: user.name
      });
    });
  });
});

//edit post
router.post('/edit/:id', function(req, res) {
  let post = {};
  post.title = req.body.title;
  post.author = req.body.author;
  post.content = req.body.content;
  post.categoryID = req.body.categoryID;

  let query = { _id: req.params.id };

  Post.update(query, post, function(err) {
    if (err) {
      console.log(err);
      return;
    } else {
      res.json({ message: 'successfully updated' });
    }
  });
});

//delete post
router.delete('/:id', function(req, res) {
  let query = { _id: req.params.id };
  Post.remove(query, function(err) {
    if (err) {
      console.log(err);
    }
    res.json({ message: 'successfully deleted' });
  });
});


module.exports = router;
