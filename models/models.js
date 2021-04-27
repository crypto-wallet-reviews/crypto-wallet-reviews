// USER MODEL
const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  imgUrl: String
});


const walletSchema = new Schema({
  name: String,
  description: String,
  averageRating: Number,
  reviews: [
    {
      user: String,
      review: String,
      rating: Number
    }
  ]
});



const User = model("User", userSchema);
const Wallet = model("Wallet", walletSchema);

module.exports = { User, Wallet };
