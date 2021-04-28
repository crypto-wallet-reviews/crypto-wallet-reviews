// const router = require("express").Router();

const loginCheck = () => {
  return (req, res, next) => {
    
    console.log('fgsdgdfgdfgg')

    if (req.session.user) {
      next();
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = loginCheck  ;