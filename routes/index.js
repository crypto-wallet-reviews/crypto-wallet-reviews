const router = require("express").Router();
const { User, Wallet } = require('../models/models');



router.get("/", (req, res, next) => {
  res.render("index");
});



router.get('/wallets', (req, res, next) => {
  Wallet.find()
    .then(wallets => {
      res.render('wallets', { walletList: wallets});
    }).catch(err => {
      next(err);
    })
})

router.get('/wallet/create', (req, res) => {
  res.render('createWallet');
})


router.post('/wallets', (req, res, next) => {
  const { name, description, rating, reviews } = req.body;
  Wallet.create({
    name,
    description,
    rating,
    reviews
  })
    .then(walletFromDB => {
      console.log(`This wallet was just created ${walletFromDB}`);
      
      res.redirect("/wallets");
    })
    .catch(err => {
      next(err)
    })
})




module.exports = router;