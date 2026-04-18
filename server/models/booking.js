
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  home: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Home", 
    required: true 
  },

  checkIn: { 
    type: Date, 
    required: true 
  },

  checkOut: { 
    type: Date, 
    required: true 
  },

  days: Number,

  pricePerDay: Number,
  totalPrice: Number,

  discount: { 
    type: Number, 
    default: 0 
  },

  finalPrice: Number,

  // ✅ Payment
  paymentMethod: { 
    type: String, 
    enum: ["COD", "ONLINE"], 
    default: "COD" 
  },

  roomsNeeded: {
  type: Number,
  default: 1,
},

guestName: {
  type: String,
  required: true,
},

phone: {
  type: String,
  required: true,
},

guestsCount: {          // 🔥 for number of people
  type: Number,
  default: 1,
},
  paymentStatus: { 
    type: String, 
    enum: ["PENDING", "PAID"], 
    default: "PENDING" 
  },

  razorpayOrderId: String,

  // ✅ Booking Status (extended)
  status: { 
    type: String, 
    enum: ["BOOKED", "CONFIRMED", "CANCELLED","REJECTED"], 
    default: "BOOKED" 
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);