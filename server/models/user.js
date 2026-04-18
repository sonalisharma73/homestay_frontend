const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },

  last_name: {
    type: String,
    trim: true
  },
PhoneNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  profilePic: {
  type: String,
  default: ""
},

  email: {
    type: String,
    required: true,
    unique: true,        // 🔥 duplicate email block
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  userType: {
    type: String,
    enum: ["host", "guest"],
    default: "guest"
  },
  gender: {
    type: String,
    enum: ["male","female","other"],
    default: "female"
  },

  // ⭐ FAVOURITES ARRAY
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
