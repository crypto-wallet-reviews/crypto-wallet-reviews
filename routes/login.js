const router = require("express").Router();
const { User, Wallet } = require('../models/models');
const bcrypt = require('bcrypt');
const { uploader, cloudinary } = require("../config/cloudinary");

//GET LOGIN ROUTE
router.get("/login", (req, res, next) => {
  res.render("login");
});

// POST LOGIN ROUTE
router.post('/login', (req, res, next) => {
  const { username, password} = req.body;
 
  User.findOne({ username: username })
    .then(userFromDB => {
      if (userFromDB === null) {       
        res.render('login', { message: 'Invalid credentials' });
        return;
      }      
      if (bcrypt.compareSync(password, userFromDB.password)) {       
        req.session.user = userFromDB;        
        res.redirect('/wallets');
      }
    })
})

// GET LOGOUT ROUTE
router.get('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      next(error);
    } else {
      res.redirect('/');
    }
  })
});

module.exports = router;