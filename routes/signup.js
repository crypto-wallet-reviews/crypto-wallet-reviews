const router = require("express").Router();
const passport = require('passport');
const { User, Wallet } = require('../models/models');
const bcrypt = require('bcrypt');
const { uploader, cloudinary } = require("../config/cloudinary");

// GET SIGNUP
router.get("/signup", (req, res, next) => {
  res.render("signup");
});


// POST SIGNUP
router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;
  
  if (password.length < 8) {
    res.render('signup', { message: 'Your password should be a minimum of 8 characters in length' });
    return
  }  
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
    return
  }  
  User.findOne({ username: username })
    .then(userFromDB => {
      
      if (userFromDB !== null) {
        res.render('signup', { message: 'This username is already taken' });
      } else {
        
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
      
  User.create({ username: username, password: hash, email: email })
     .then(createdUser => {
       res.redirect('/login');
      })
    }
  })
});

module.exports = router;