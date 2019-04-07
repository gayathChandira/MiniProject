const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const config = require('./config/database');
const passport = require('passport');

mongoose.connect(config.database, { dbName: 'miniProject' });
let db = mongoose.connection;

//Check connection
db.once('open', function() {
  console.log('connected to mongodb');
});

//Check for db errors
db.on('error', function(err) {
  console.log(err);
});

//init app
const app = express();
app.use(expressValidator());

//bring in models
let Post = require('./models/post');
let User = require('./models/user');

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));



//passport config
require('./config/passport');
//passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get('/', (req, res) => {
  Post.find({}, function(err, Posts) {
    if (err) {
      console.log(err);
    } else {
      res.json({
        title: 'Posts',
        Posts: Posts
      });
    }
  });
});



let users = require('./routes/users');
let posts = require('./routes/posts');
app.use('/posts',passport.authenticate('jwt', {session: false}), posts);
app.use('/users', users);

//start server
app.listen(3000, function() {
  console.log('Server started on port 3000...');
});
