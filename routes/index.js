const router = require("express").Router();
const { User, Wallet } = require('../models/models');
const { uploader, cloudinary } = require("../config/cloudinary");
const loginCheck  = require('./middleware');

//GET HOMEPAGE ROUTE
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET ABOUT ROUTE
router.get("/about", (req, res, next) => {
  res.render("about")
})

//GET BROWSE WALLETS ROUTE
router.get('/wallets', (req, res, next) => {
  Wallet.find()
    .then(wallets => {
      res.render('wallets', { walletList: wallets});
    }).catch(err => {
      next(err);
    })
})

//GET CREATE WALLET ROUTE
router.get('/wallet/create', loginCheck(), (req, res, next) => {
  console.log(loginCheck);  
  res.render('createWallet');
})


//POST CREATE WALLET ROUTE
router.post('/wallets',uploader.single('photo'), (req, res, next) => {
  const creator = req.session.user.username;
  const { name, description, rating, reviews } = req.body;  
  var imgName = getSafe(() => req.file.originalname, "");
  var imgPath = getSafe(() => req.file.path, "");

  Wallet.create({
    name,
    description,
    rating,
    reviews,
    imgPath,
    imgName,
    creator
  })
    .then(walletFromDB => {
      console.log(`This wallet was just created ${walletFromDB}`);
      
      res.redirect("/wallets");
    })
    .catch(err => {
      next(err)
    })
})

function getSafe(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

module.exports = router;