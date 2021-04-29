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
hbs.registerPartials(__dirname + '/views/partials');

//Helper function to provide a repeat function in hbs template
hbs.registerHelper("times", function (n, block) {
  var accum = "";
  for (var i = 0; i < n; ++i) accum += block.fn(i);
  return accum;
});

hbs.registerHelper("ratings", function (n, block) {
  var accum = "";
  for (var i = 0; i < 5; ++i) {
    if (n > i) {
      accum += '<span class="fa fa-star checked"></span>';
    } else {
      accum += '<span class="fa fa-star unchecked"></span>';
    }
  }
  return accum;
});

hbs.registerHelper("averageRating", function (reviews, block) {
  return averageRating(reviews);
});
///////
hbs.registerHelper("averageRatingView", function (reviews, block) {
  return averageRatingView(reviews);
});
///////
hbs.registerHelper("averageRatingsStars", function (reviews, block) {
  var accum = "";
  var n = averageRating(reviews);
  for (var i = 0; i < 5; ++i) {
    if (n > i) {
      accum += '<span class="fa fa-star checked"></span>';
    } else {
      accum += '<span class="fa fa-star unchecked"></span>';
    }
  }
  return accum;
});

function averageRating(reviews) {
   var accum = 0;
   if (reviews.length === 0) {
     return;
   }
   for (var i = 0; i < reviews.length; ++i) {
     accum += reviews[i].rating;
   }
   return Math.floor(accum / reviews.length);  
}

///////
function averageRatingView(reviews) {
  var accum = 0;
  if (reviews.length === 0) {
    return "No reviews yet";
  }
  for (var i = 0; i < reviews.length; ++i) {
    accum += reviews[i].rating;
  }
  return `${Math.round((accum / reviews.length)*10)/10}/5`;  
}
///////

hbs.registerHelper("image", function (imagePath, block) {
    if (imagePath == "") {
      return `<img src="iconPlaceholder.png" width="100px" heigth="100px" alt="image missing">`;
    } else {
      return  `<img src=${imagePath} width="100px" heigth="100px" alt="image missing">`;
    }
});


const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// session configuration

const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("./db/index");
const DB_URL = "mongodb://localhost/passport";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: true,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI //DB_URL ,
    }),
  })
);

app.use(express.static("public/images")); 

// end of session configuration

// passport configuration
// http://www.passportjs.org/docs/configure/
const { User, Wallet } = require("./models/models");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// passport wants to store as little data as possible in the session so it only uses
// the id's (or someting else if we would want to implement that) and not the whole
// user object
// this method is used by passport to put the id of the user into the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// this is used to retrieve the user by it's id (that is stored in the session)
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((dbUser) => {
      done(null, dbUser);
    })
    .catch((err) => {
      done(err);
    });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    // this logic will be executed when we log in
    User.findOne({ username: username })
      .then((userFromDB) => {
        if (userFromDB === null) {
          // there is no user with this username
          done(null, false, { message: "Wrong Credentials" });
        } else if (!bcrypt.compareSync(password, userFromDB.password)) {
          // the password does not match
          done(null, false, { message: "Wrong Credentials" });
        } else {
          // everything correct - user should be logged in
          done(null, userFromDB);
        }
      })
      .catch((err) => {
        next(err);
      });
  })
);

app.use(passport.initialize());
app.use(passport.session());

// end of passport configurations

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


// validation email
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}