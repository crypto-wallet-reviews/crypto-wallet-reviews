// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// session configuration

const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('./db/index');
const DB_URL = 'mongodb://localhost/passport';


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: true,
    store: MongoStore.create({
      mongoUrl: DB_URL
    })
  })
)

// end of session configuration


// passport configuration
// http://www.passportjs.org/docs/configure/
const { User, Wallet } = require('./models/models');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// passport wants to store as little data as possible in the session so it only uses 
// the id's (or someting else if we would want to implement that) and not the whole 
// user object
// this method is used by passport to put the id of the user into the session
passport.serializeUser((user, done) => {
  done(null, user._id);
})

// this is used to retrieve the user by it's id (that is stored in the session)
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(dbUser => {
      done(null, dbUser)
    })
    .catch(err => {
      done(err);
    })
})

passport.use(
  new LocalStrategy((username, password, done) => {
    // this logic will be executed when we log in
    User.findOne({ username: username })
      .then(userFromDB => {
        if (userFromDB === null) {
          // there is no user with this username
          done(null, false, { message: 'Wrong Credentials' });
        } else if (!bcrypt.compareSync(password, userFromDB.password)) {
          // the password does not match
          done(null, false, { message: 'Wrong Credentials' });
        } else {
          // everything correct - user should be logged in
          done(null, userFromDB);
        }
      })
      .catch(err => {
        next(err);
      })
  })
)

app.use(passport.initialize());
app.use(passport.session());

// end of passport configuration

// default value for title local
const projectName = "Crypto-Wallet-Reviews";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with Ironlauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const signup = require("./routes/signup");
app.use("/", signup);

const login = require("./routes/login");
app.use("/", login);

const reviews = require("./routes/reviews");
app.use("/", reviews);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
