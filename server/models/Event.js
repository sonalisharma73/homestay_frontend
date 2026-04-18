const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["event", "place"],
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    location: {
      city: {
        type: String,
        trim: true
      },
      place: {
        type: String,
        trim: true
      }
    },

    // 🔥 EVENT FIELDS
    startDate: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "event";
      }
    },

    endDate: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "event";
      }
    },

    // 🔥 TOURIST PLACE FIELD
    duration: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "place";
      }
    },

    thingsToDo: {
      type: String,
      trim: true
    },

    highlights: {
      type: String,
      trim: true
    },

    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 5;
        },
        message: "Maximum 5 images allowed"
      }
    }
  },
  {
    timestamps: true
  }
);

// 🔥 EXTRA VALIDATION (start < end)
eventSchema.pre("save", function (next) {
  if (this.type === "event" && this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      return next(new Error("Start date must be before end date"));
    }
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);