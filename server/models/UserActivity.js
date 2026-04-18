const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  homeId: { type: mongoose.Schema.Types.ObjectId, ref: "Home" },

  action: {
    type: String,
    enum: ["view", "favourite", "book"],
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserActivity", userActivitySchema);