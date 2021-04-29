const router = require("express").Router();
const { User, Wallet } = require('../models/models');
const bcrypt = require('bcrypt');
const { uploader, cloudinary } = require("../config/cloudinary");
const loginCheck  = require('./middleware');


//POST WALLET REVIEW ROUTE
router.post('/wallet/review/:id', (req, res, next) => {
  
  const user = req.session.user;
  const { review, rating } = req.body;

  console.log(user, review);

  Wallet.findByIdAndUpdate(req.params.id, {
    $push: { reviews: { user: user.username, review: review, rating: rating } },
  })
    .then(wallet => {
      console.log(wallet)
      res.redirect(`/wallet/${req.params.id}`);
    })
    .catch(err => {
      next(err);
    })
});
  

//GET WALLET REVIEW ROUTE
router.get('/wallet/review/:id', loginCheck(), (req, res, next) => {  
  
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


//WALLET INFO ROUTE
router.get('/wallet/:id', loginCheck(), (req, res, next) => {

  Wallet.findById(req.params.id)
    .then(wallet => {
    res.render('walletInfo', { walletInfo: wallet });
    })
    .catch(err => {
      next(err);
    })
})

//WALLET DELETE
router.get('/wallet/delete/:id', (req, res, next) => {  

  console.log(req.session);
  console.log(req.session.user.username);
  
  Wallet.findById(req.params.id)
    .then(wallet => {
      if (wallet.creator === req.session.user.username) {
        Wallet.findByIdAndDelete(req.params.id)
          .then(() => {
            res.redirect('/wallets');
          })
          .catch(err => {
            next(err);
          })
      } else {

  Wallet.findById(req.params.id)
    .then(wallet => {
    res.render('walletInfo', { walletInfo: wallet, message: 'Only wallet creators can delete' });
    })
    .catch(err => {
      next(err);
    })
    }    
  });
});

module.exports = router;
