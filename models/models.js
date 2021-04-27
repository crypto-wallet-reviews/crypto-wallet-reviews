// USER MODEL
const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
  email: String,
  reviews: [String],
  imgName: String,
  imgPath: String,
  publicId: String
});


const walletSchema = new Schema({
  name: String,
  description: String,
  rating: Number,
  imgName: String,
  imgPath: String,
  publicId: String,
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'},
        review: String
    }
  ]
});



const User = model("User", userSchema);
const Wallet = model("Wallet", walletSchema);

module.exports = { User, Wallet };
