const router = require("express").Router();
const passport = require('passport');
const User = require('../models/models');
const bcrypt = require('bcrypt');

// GET SIGNUP
router.get("/signup", (req, res, next) => {
  res.render("signup");
});

// POST SIGNUP
router.post('/signup', (req, res, next) => {
  
  const { username, password } = req.body;
  console.log({ username, password });
  // AUTHENTICATE
  if (password.length < 8) {
    res.render('signup', { message: 'Your password has to be 8 chars min' });
    return
  }
  if (username === '') {
    res.render('signup', { message: 'Your username cannot be empty' });
    return
  }
  // DB
  User.findOne({ username: username })
    .then(userFromDB => {
      
      if (userFromDB !== null) {
        res.render('signup', { message: 'This username is already taken' });
      } else {
        
        // HASHING
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        console.log(hash);

        // CREATE USER
        User.create({ username: username, password: hash })
          .then(createdUser => {
            console.log(createdUser);
            
            // AUTOMATIC LOGIN
            // req.login(createdUser, err => {
            //   if (err) {
            //     next(err);
            //   } else {
            //     res.redirect('/home');
            //   }
            // })
            // REDIRECT TO LOGIN
            res.redirect('login');
          })
      }
    })
});

module.exports = router;
