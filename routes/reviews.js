const router = require("express").Router();
const passport = require('passport');
const { User, Wallet } = require('../models/models');
const bcrypt = require('bcrypt');
const { uploader, cloudinary } = require("../config/cloudinary");

router.post('/wallet/review/:id', (req, res, next) => {
  
  const loggedInUser = req.session.user;
  const { review } = req.body;

  Wallet.findByIdAndUpdate(req.params.id, {
    user: loggedInUser,
    review: review
  })
    .then(wallet => {
      console.log(wallet)
      res.redirect("/wallets")
    })
    .catch(err => {
      next(err);
    })
});
  


router.get('/wallet/review/:id', (req, res, next) => {  
  
  console.log(req.params.id)

  console.log(req.session.user)

  Wallet.findById(req.params.id)
    .then(wallet => {
      res.render('review', { walletInfo: wallet });
    })
    .catch(err => {
      next(err);
    })
});



router.get('/wallet/:id', (req, res, next) => {

  Wallet.findById(req.params.id)
    .then(wallet => {
    res.render('walletInfo', { walletInfo: wallet });
    })
    .catch(err => {
      next(err);
    })
})



module.exports = router;
