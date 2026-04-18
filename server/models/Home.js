const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const homeSchema = new mongoose.Schema(
  {
    // 🏷 basic
    housename: { type: String, required: true },
    description: String,

    // 🏠 NEW
    placeType: {
      type: String,
      enum: ["Entire Place", "Private Room", "Shared Room"],
      required: true
    },

    propertyType: {
      type: String,
      enum: ["House", "Flat", "Bungalow", "Villa", "Farmhouse"],
      required: true
    },
    // hostid
   hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
      },

    // 💰 pricing
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },

    // 📍 ADDRESS
    address: {
      houseNo: String,
      street: String,
      area: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" }
    },

    // 🖼 PHOTOS (min 5)
    photos: {
      type: [String],
      validate: [(val) => val.length >= 5, "Upload at least 5 photos"]
    },

    // 👤 OWNER
    owner: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },

      idProofType: {
        type: String,
        enum: ["Aadhar", "PAN", "Driving License", "Passport"]
      },

      idProofNumber: String,
      idProofImage: String
    },

    // 🏡 HOUSE DETAILS
    houseDetails: {
      bedrooms: { type: Number, default: 1 },
      bathrooms: { type: Number, default: 1 },
      beds: { type: Number, default: 1 },
      guests: { type: Number, default: 1 }
      , availableRooms: { type: Number, default: 1 }
    },

    // 🛋 amenities
    amenities: [String],
    rules: [String],

    // ⭐ rating
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", homeSchema);
