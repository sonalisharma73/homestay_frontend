// const Event = require("../models/Event");

// // ➕ ADD EVENT
// exports.addEvent = async (req, res) => {
 
//   try {
//     // 🔥 SAFE IMAGE HANDLING
//     const imagePaths = req.files
//       ? req.files.map(file => file.path)
//       : [];

//     const {
//       title,
//       description,
//       city,
//       place,
//       startDate,
//       endDate,
//       duration,
//       thingsToDo,
//       highlights,
//       type
//     } = req.body;

//     // 🔥 BASIC VALIDATION
//     if (!title || !type) {
//       return res.status(400).json({ msg: "Title and type required" });
//     }

//     // 🔥 DATE VALIDATION (EVENT ONLY)
//     if (type === "event" && startDate && endDate) {
//       if (new Date(startDate) > new Date(endDate)) {
//         return res.status(400).json({
//           msg: "Start date must be before end date"
//         });
//       }
//     }

//     const event = await Event.create({
//       hostId: req.session.userId,

//       type,
//       title,
//       description,

//       location: {
//         city,
//         place
//       },

//       // 🔥 CONDITIONAL FIELDS
//       startDate: type === "event" ? startDate : undefined,
//       endDate: type === "event" ? endDate : undefined,
//       duration: type === "place" ? duration : undefined,

//       thingsToDo,
//       highlights,

//       images: imagePaths
//     });

//     res.status(201).json({ success: true, event });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Error adding event" });
//   }
// };
const mongoose = require("mongoose");
const Event = require("../models/Event");

exports.addEvent = async (req, res) => {
  try {

    // 🔐 AUTH CHECK
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Login required" });
    }

    const imagePaths = req.files
      ? req.files.map(file => file.path.replace(/\\/g, "/"))
      : [];

    const {
      title,
      description,
      city,
      place,
      startDate,
      endDate,
      duration,
      thingsToDo,
      highlights,
      type
    } = req.body;

    // 🔥 VALIDATION
    if (!title || !type || !city) {
      return res.status(400).json({
        msg: "Title, type and city are required"
      });
    }

    // 🔥 IMAGE LIMIT
    if (imagePaths.length > 5) {
      return res.status(400).json({
        msg: "Maximum 5 images allowed"
      });
    }

    // 🔥 DATE CHECK
    if (type === "event" && startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        return res.status(400).json({
          msg: "Start date must be before end date"
        });
      }
    }

    const event = await Event.create({
      hostId: req.session.userId,

      type,
      title,
      description,

      location: {
        city,
        place
      },

      startDate: type === "event" ? startDate : undefined,
      endDate: type === "event" ? endDate : undefined,
      duration: type === "place" ? duration : undefined,

      thingsToDo,
      highlights,
      images: imagePaths
    });

    res.status(201).json({ success: true, event });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error adding event" });
  }
};


// 📥 GET EVENTS
exports.getEvents = async (req, res) => {
  // console.log("Fetching events...");
  try {

    const events = await Event.find()
      .sort({ createdAt: -1 }); // latest first

    res.json(events);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching events" });
  }
};

// exports.SingleEvents = async (req, res) => {
//   const event = await Event.findById(req.params.id);
//   res.json(event);
// };



exports.SingleEvents = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 invalid id check
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    res.json(event);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching event" });
  }
};