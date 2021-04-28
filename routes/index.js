const router = require("express").Router();
const { User, Wallet } = require('../models/models');
const { uploader, cloudinary } = require("../config/cloudinary");
const loginCheck  = require('./middleware');



router.get("/", (req, res, next) => {
  res.render("index");

});


router.get("/about", (req, res, next) => {
  res.render("about")
})


router.get('/wallets', (req, res, next) => {
  Wallet.find()
    .then(wallets => {
      res.render('wallets', { walletList: wallets});
    }).catch(err => {
      next(err);
    })
})


router.get('/wallet/create', loginCheck(), (req, res, next) => {
  console.log(loginCheck);
  
  res.render('createWallet');
})




router.post('/wallets',uploader.single('photo'), (req, res, next) => {

  console.log(req.file)

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