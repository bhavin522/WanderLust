const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Listing'
    }
  ],
  avatar: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  bio: {
    type: String,
    default: ""
  },
  phoneNumber: String,
  location: String,
  dateJoined: {
    type: Date,
    default: Date.now
  },
  preferences: {
    currency: {
      type: String,
      default: "INR"
    },
    language: {
      type: String,
      default: "English"
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
