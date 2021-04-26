const router = require("express").Router();
const { User, Wallet } = require('../models/models');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


router.get('/wallets', (req, res, next) => {
  // get all the wallets
  Wallet.find()
    .then(wallets => {
      
      res.render('wallets', { walletList: wallets });
    }).catch(err => {
      next(err);
    })
})


router.post('/wallets', (req, res, next) => {
  // retrieve the fields from the request body
  console.log(req.body);
  const { name, description, rating, reviews } = req.body;
  // create a new document in the database
  Wallet.create({
    name,
    description,
    rating,
    reviews
  })
    .then(walletFromDB => {
      console.log(`This wallet was just created ${walletFromDB}`);
      // res.render('bookDetails', { bookDetails: bookFromDB })
      
      // this is how you do a redirect in express
      res.redirect("/wallets");
    })
    .catch(err => {
      next(err)
    })
})


router.get('/wallet/create', (req, res) => {
  res.render('createWallet');
})






module.exports = router;