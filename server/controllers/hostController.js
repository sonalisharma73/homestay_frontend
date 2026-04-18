const mongoose = require("mongoose");
const Home = require("../models/Home");
const Booking = require("../models/booking");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const Event = require("../models/Event");

/* ================= Add Home ================= */

/* ================= ADD HOME ================= */
exports.postHomeAdd = async (req, res) => {
  console.log("Adding new home...");  
  try {
    const {
      housename,
      price,
      discount,
      description,
      placeType,
      propertyType,

      houseNo,
      street,
      area,
      city,
      state,
      pincode,

      ownerName,
      ownerEmail,
      ownerPhone,
      idProofNumber,
      idProofType,

      bedrooms,
      bathrooms,
      beds,
      guests,
    } = req.body;
   console.log("Received data:", req.body); 
   console.log("FILES:", req.files);

    /* ================= REQUIRED CHECK ================= */
    if (!housename || !price || !ownerEmail) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    /* ================= DUPLICATE CHECK ================= */
    // same owner + same houseNo + same name → block
    const existing = await Home.findOne({
      "owner.email": ownerEmail,
      housename: housename,
      "address.houseNo": houseNo,
      "address.city": city,
    });

    if (existing) {
      return res.status(400).json({
        message: "You already listed this property",
      });
    }

    /* ================= PHOTO CHECK ================= */
    if (!req.files || !req.files.photos) {
      return res.status(400).json({
        message: "Upload at least 1 photo",
      });
    }

    /* ================= SAVE PHOTOS ================= */
    const photos = req.files.photos.map(
      (file) => `uploads/${file.filename}`
    );

    /* ================= ID IMAGE ================= */
    let idProofImage = "";
    if (req.files.idProofImage && req.files.idProofImage.length > 0) {
      idProofImage = `uploads/${req.files.idProofImage[0].filename}`;
    }

    /* ================= AMENITIES ================= */
    let amenities = [];
    if (req.body.amenities) {
      amenities = Array.isArray(req.body.amenities)
        ? req.body.amenities
        : [req.body.amenities];
    }

    /* ================= CREATE HOME ================= */
    const home = new Home({
      housename,
      price,
      discount: discount || 0,
      description,
      placeType,
      propertyType,
      photos,
        hostId: req.session.userId, 
      address: {
        houseNo,
        street,
        area,
        city,
        state,
        pincode,
        country: "India",
      },

      owner: {
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone,
        idProofType,
        idProofNumber,
        idProofImage,
      },

      houseDetails: {
        bedrooms,
        bathrooms,
        beds,
        guests,
      },

      amenities,
    });

    await home.save();

    res.json({
      message: "Home added successfully!",
    });

  } catch (err) {
    console.error("ADD HOME ERROR:", err);

    res.status(500).json({
      message: "Add home failed",
    });
  }
};

exports.postEditHome = async (req, res) => {
  try {
    const { id } = req.body;
    const home = await Home.findById(id);
    if (!home) return res.status(404).json({ error: "Home not found" });

    home.housename = req.body.housename;
    home.price = req.body.price;
    home.discount = req.body.discount || 0;
    home.description = req.body.description;
    home.placeType = req.body.placeType;
    home.propertyType = req.body.propertyType;

    home.address = {
      houseNo: req.body.houseNo,
      street: req.body.street,
      area: req.body.area,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      country: "India",
    };

    home.owner = {
      name: req.body.ownerName,
      email: req.body.ownerEmail,
      phone: req.body.ownerPhone,
      idProofType: req.body.idProofType,
      idProofNumber: req.body.idProofNumber,
      idProofImage: home.owner.idProofImage,
    };

    home.houseDetails = {
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      beds: req.body.beds,
      guests: req.body.guests,
    };

    if (req.body.amenities) {
      home.amenities = Array.isArray(req.body.amenities)
        ? req.body.amenities
        : [req.body.amenities];
    }

    // photos
    if (req.files?.photos?.length) {
      home.photos.forEach((p) => {
        const oldPath = path.join(__dirname, "..", p);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      });

      home.photos = req.files.photos.map(
        (file) => `uploads/${file.filename}`
      );
    }

    // id image
    if (req.files?.idProofImage?.length) {
      home.owner.idProofImage =
        `uploads/${req.files.idProofImage[0].filename}`;
    }

    await home.save();
    res.json({ message: "Updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
};



 
    /* ================= OWNER ================= */



/* ================= Get Homes ================= */
exports.getHostHome = async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ msg: "Login required" });
    }

    const homes = await Home.find({ hostId: userId });

    res.json(homes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching homes" });
  }
};

/* ================= Edit Home (GET) ================= */
exports.getEditHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const home = await Home.findById(homeId);
    if (!home) return res.status(404).json({ error: "Home not found" });
    res.json({ home });
  } catch (err) {
    console.error("Error fetching home:", err);
    res.status(500).json({ error: "Failed to fetch home" });
  }
};

/* ================= Edit Home (POST) ================= */

/* ================= Delete Home ================= */

exports.postDeleteHome = async (req, res) => {
  try {
    const { homeId } = req.params;
    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({ error: "Home not found" });
    }

    // delete all photos
    home.photos.forEach((p) => {
      const photoPath = path.join(__dirname, "..", p);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    });

    // delete id proof image
    if (home.owner?.idProofImage) {
      const idPath = path.join(__dirname, "..", home.owner.idProofImage);
      if (fs.existsSync(idPath)) {
        fs.unlinkSync(idPath);
      }
    }

    await Home.findByIdAndDelete(homeId);

    res.json({ message: "Home deleted successfully!" });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
};




// exports.getHostStats = async (req, res) => {
//   try {
//     const hostId = req.session.userId;

//     if (!hostId) {
//       return res.status(401).json({ msg: "Login required" });
//     }

//     const homes = await Home.find({ hostId });
//     const homeIds = homes.map(h => h._id);

//     const bookings = await Booking.find({
//       home: { $in: homeIds },
//       status: { $in: ["CONFIRMED", "BOOKED"] }
//     });

//     const totalHomes = homes.length;
//     const totalBookings = bookings.length;

//     const totalEarnings = bookings.reduce(
//       (sum, b) => sum + (b.finalPrice || 0),
//       0
//     );

//     res.json({
//       totalHomes,
//       totalBookings,
//       totalEarnings
//     });

//   } catch (err) {
//     res.status(500).json({ msg: "Stats error" });
//   }
// };
exports.getHostStats = async (req, res) => {
  try {

    const hostId = new mongoose.Types.ObjectId(req.params.id);

    // 1️⃣ find homes of this host
    const homes = await Home.find({ hostId });

    const homeIds = homes.map(h => h._id);

    // 2️⃣ find bookings for those homes
    const bookings = await Booking.find({
      home: { $in: homeIds }
    });

    const totalHomes = homes.length;
    const totalBookings = bookings.length;

    const confirmedBookings = bookings.filter(
      b => b.status === "CONFIRMED"
    ).length;

    const cancelledBookings = bookings.filter(
      b => b.status === "CANCELLED"
    ).length;

    const completedBookings = bookings.filter(
      b => b.status === "BOOKED"
    ).length;

    const upcomingBookings = bookings.filter(
      b =>
        b.status === "CONFIRMED" &&
        new Date(b.checkIn) > new Date()
    ).length;

    // if not working hten change compted to CONFIRM 
    const totalEarnings = bookings
      .filter(b => b.status === "COMPLETED")
      .reduce((sum, b) => sum + (b.finalPrice || 0), 0);

    res.json({
      totalHomes,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      upcomingBookings,
      totalEarnings
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Stats error" });
  }
};

exports.getHostProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: "Profile error" });
  }
};


exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("home");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    if (booking.home.hostId.toString() !== req.session.userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
};


// edit delete events


// GET MY EVENTS
exports.getMyEvents = async (req, res) => {
  try {
   
    const events = await Event.find({ hostId: req.session.userId })
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching host events" });
  }
};

// DELETE EVENT

// exports.deleteEvent = async (req, res) => {
//   console.log("Delete event ID:", req.params.id);
//   console.log("User ID:", req.session.userId);
//   try {
//     const event = await Event.findById(req.params.id);

//     if (!event) {
//       return res.status(404).json({ msg: "Event not found" });
//     }

//     // 🔥 OWNER CHECK
//     if (event.hostId.toString() !== req.session.userId) {
//       return res.status(403).json({ msg: "Unauthorized" });
//     }

//     await Event.findByIdAndDelete(req.params.id);

//     res.json({ msg: "Deleted successfully" });

//   } catch (err) {
//     res.status(500).json({ msg: "Error deleting event" });
//   }
// };


exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (!event.hostId.equals(req.session.userId)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting event" });
  }
};



exports.updateEvent = async (req, res) => {
  console.log("Update event ID:", req.params.id);
  console.log("User ID:", req.session.userId);
  console.log("Request body:", req.body);
  console.log("Request files:", req.files); 
  console.log(
    "Old images (if any):",
    req.body.oldImages ? JSON.parse(req.body.oldImages) : []      
  )
  console.log("is logged in:", req.session.isLoggedIn);
  try {
    if (!req.session.isLoggedIn) {
      return res.status(401).json({ msg: "Login required" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ msg: "Event not found" });
    }

    if (event.hostId.toString() !== String(req.session.userId)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    // 🔹 parse old images
    let oldImages = [];
    if (req.body.oldImages) {
      oldImages = JSON.parse(req.body.oldImages);
    }

    // 🔹 new uploaded images
    const newImages = req.files?.map(file => "uploads/" + file.filename) || [];

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title || event.title,
type: req.body.type || event.type,
location: {
  city: req.body.city || event.location?.city
},
startDate: req.body.startDate || event.startDate,
endDate: req.body.endDate || event.endDate,
duration: req.body.duration || event.duration,
startTime: req.body.startTime || event.startTime,
endTime: req.body.endTime || event.endTime,
        images: [...oldImages, ...newImages] // 🔥 merge images
      },
      { new: true }
    );

    res.json({ success: true, data: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
};