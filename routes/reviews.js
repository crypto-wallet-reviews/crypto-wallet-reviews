const router = require("express").Router();
const passport = require('passport');
const { User, Wallet } = require('../models/models');
const bcrypt = require('bcrypt');


router.get('/wallet/review/:id', (req, res, next) => {  
  console.log(req.params.id)

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
