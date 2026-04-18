
const Booking = require("../models/booking");
const Home = require("../models/Home");
const User = require("../models/user");
const UserActivity = require("../models/UserActivity");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/* ==============================
   RAZORPAY
============================== */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

/* ==============================
   EMAIL SETUP
============================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmails(booking, guestEmail, hostEmail) {
  try {
    const html = `
      <h2>Booking Confirmed 🏠</h2>
      <p>CheckIn: ${booking.checkIn}</p>
      <p>CheckOut: ${booking.checkOut}</p>
      <p>Rooms: ${booking.roomsNeeded || 1}</p>
      <p>Total: ₹${booking.finalPrice}</p>
    `;

    if (guestEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: guestEmail,
        subject: "Booking Confirmation",
        html,
      });
    }

    if (hostEmail) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: hostEmail,
        subject: "New Booking Received",
        html,
      });
    }
  } catch (err) {
    console.log("Email error:", err.message);
  }
}


async function sendStatusEmail(booking, guestEmail, hostEmail, status) {
  try {
    const html = `
      <h2>Booking ${status}</h2>
      <p>Home: ${booking.home.housename}</p>
      <p>CheckIn: ${booking.checkIn}</p>
      <p>CheckOut: ${booking.checkOut}</p>
      <p>Total: ₹${booking.finalPrice}</p>
      <p>Status: ${status}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: guestEmail,
      subject: `Booking ${status}`,
      html,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: hostEmail,
      subject: `Booking ${status}`,
      html,
    });

  } catch (err) {
    console.log("Status email error:", err.message);
  }
}
/* ==============================
   CHECK AVAILABILITY
============================== */
// exports.checkAvailability = async (req, res) => {
//   try {
//     const { homeId, checkIn, checkOut, roomsNeeded } = req.body;

//     const start = new Date(checkIn);
//     const end = new Date(checkOut);

//     const home = await Home.findById(homeId);
//     if (!home) return res.status(404).json({ msg: "Home not found" });

//     const totalRooms = home.houseDetails?.bedrooms || 1;

//     const bookings = await Booking.find({
//       home: homeId,
//       status: { $in: ["BOOKED", "CONFIRMED"] },
//       checkIn: { $lt: end },
//       checkOut: { $gt: start },
//     });

//     let bookedRooms = 0;
//     bookings.forEach(b => bookedRooms += b.roomsNeeded || 1);

//     const availableRooms = totalRooms - bookedRooms;

//     res.json({
//       available: availableRooms >= roomsNeeded,
//       availableRooms,
//       bookedRooms,
//       totalRooms,
//     });

//   } catch (err) {
//     res.status(500).json({ msg: "Availability error" });
//   }
// };


exports.checkAvailability = async (req, res) => {
  try {
    const { homeId, checkIn, checkOut, roomsNeeded } = req.body;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const home = await Home.findById(homeId);
    if (!home) return res.status(404).json({ msg: "Home not found" });

    const totalRooms = home.houseDetails?.bedrooms || 1;

    // ⭐ overlapping bookings
    const bookings = await Booking.find({
      home: homeId,
      status: { $in: ["BOOKED", "CONFIRMED"] },
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });

    // ⭐ calculate booked rooms
    let bookedRooms = 0;

    bookings.forEach((b) => {
      bookedRooms += b.roomsNeeded || 1;
    });

    // ⭐ available rooms
    let availableRooms = totalRooms - bookedRooms;

    if (availableRooms < 0) availableRooms = 0;

    // ⭐ response
    res.json({
      available: availableRooms >= roomsNeeded,
      availableRooms,
      bookedRooms,
      totalRooms,
    });

  } catch (err) {
    console.log("Availability Error:", err);
    res.status(500).json({ msg: "Availability error" });
  }
};

/* ==============================
   COD BOOKING
============================== */
// exports.createCODBooking = async (req, res) => {
//   try {
//     console.log("COD:", req.body);

//     const user = await User.findById(req.body.user);
//     if (!user) return res.status(400).json({ msg: "User not found" });

//     const home = await Home.findById(req.body.home);
//     if (!home) return res.status(400).json({ msg: "Home not found" });

//     const booking = await Booking.create({
//       ...req.body,
//       paymentMethod: "COD",
//       paymentStatus: "PENDING",
//       status: "CONFIRMED",
//     });

//     try {
//       await sendEmails(booking, user.email, home.owner.email);
//     } catch (mailErr) {
//       console.log("Email failed:", mailErr.message);
//     }

//     res.json({ success: true, booking });

//   } catch (err) {
//     console.log("SERVER ERROR:", err);
//     res.status(500).json({ msg: err.message });

//   }
// };

exports.createCODBooking = async (req, res) => {
  try {
    console.log("COD:", req.body);

    const user = await User.findById(req.body.user);
    if (!user) return res.status(400).json({ msg: "User not found" });

    const home = await Home.findById(req.body.home);
    if (!home) return res.status(400).json({ msg: "Home not found" });

    const roomsNeeded = req.body.roomsNeeded || 1;

    // ⭐ check availability
    if (home.houseDetails.availableRooms < roomsNeeded) {
      return res.status(400).json({
        msg: "Not enough rooms available"
      });
    }

    // ⭐ create booking
    const booking = await Booking.create({
      ...req.body,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      status: "CONFIRMED",
    });

//     await UserActivity.create({
//   userId: req.body.user,
//   homeId: req.body.home,
//   action: "book"
// });


    // ⭐ decrease availability
    await Home.findByIdAndUpdate(
      home._id,
      {
        $inc: { "houseDetails.availableRooms": -roomsNeeded }
      }
    );

    try {
      await sendEmails(booking, user.email, home.owner.email);
    } catch (mailErr) {
      console.log("Email failed:", mailErr.message);
    }

    res.json({ success: true, booking });

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};


/* ==============================
   CREATE PAYMENT ORDER
============================== */
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Razorpay error" });
  }
};

/* ==============================
   VERIFY PAYMENT
============================== */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData,
    } = req.body;

    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated !== razorpay_signature) {
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    const booking = await Booking.create({
      ...bookingData,
      paymentMethod: "ONLINE",
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayOrderId: razorpay_order_id,
    });
    await UserActivity.create({
  userId: req.body.user,
  homeId: req.body.home,
  action: "book"
});

    const user = await User.findById(booking.user);
    const home = await Home.findById(booking.home);

    await sendEmails(booking, user.email, home.owner.email);

    res.json({ success: true, booking });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Verify failed" });
  }
};

/* ==============================
   GET USER BOOKINGS
============================== */
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("home")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch {
    res.status(500).json({ msg: "Fetch error" });
  }
};

/* ==============================
   CANCEL BOOKING
// ============================== */
// exports.cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id)
//       .populate({
//         path: "home",
//         populate: { path: "owner" }
//       })
//       .populate("user");

//     if (!booking) {
//       return res.status(404).json({ msg: "Booking not found" });
//     }

//     booking.status = "CANCELLED";
//     await booking.save();

//     console.log("Guest Email:", booking.user.email);
//     console.log("Host Email:", booking.home.owner.email);

//     await sendStatusEmail(
//       booking,
//       booking.user.email,
//       booking.home.owner.email,
//       "CANCELLED"
//     );

//     res.json({ success: true, booking });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Cancel failed" });
//   }
// };









 exports.cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "home",
        populate: { path: "owner" }
      })
      .populate("user");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // already cancelled check
    if (booking.status === "CANCELLED") {
      return res.status(400).json({ msg: "Booking already cancelled" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    // ⭐ revert availability
    const roomsBooked = booking.roomsNeeded || 1;

    await Home.findByIdAndUpdate(
      booking.home._id,
      {
        $inc: { availableRooms: roomsBooked }
      }
    );

    console.log("Guest Email:", booking.user.email);
    console.log("Host Email:", booking.home.owner.email);

    await sendStatusEmail(
      booking,
      booking.user.email,
      booking.home.owner.email,
      "CANCELLED"
    );

    res.json({ success: true, booking });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Cancel failed" });
  }
};


exports.completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("home")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    booking.status = "COMPLETED";
    await booking.save();

    await sendStatusEmail(
      booking,
      booking.user.email,
      booking.home.owner.email,
      "COMPLETED"
    );

    res.json({ success: true, booking });

  } catch (err) {
    res.status(500).json({ msg: "Complete failed" });
  }
};

/* ==============================
   ADD REVIEW
============================== */
// exports.addReview = async (req, res) => {
//   console.log("out in try ")
//   try {
//     const { homeId, userId,hostId, rating, comment } = req.body;
//       console.log("in add review ");
//       console.log("rer body ",req.body)
//     const home = await Home.findById(homeId);
//     if (!home) {
//       return res.status(404).json({ msg: "Home not found" });
//     }

//     const booking = await Booking.findOne({
//       user: userId,
//       home: homeId,
//       status: "CONFIRMED",
//     });

//     if (!booking) {
//       return res.status(403).json({
//         msg: "You can review only after stay",
//       });
//     }

//     if (booking.checkOut && new Date(booking.checkOut) > new Date()) {
//       return res.status(403).json({
//         msg: "Review allowed after checkout",
//       });
//     }

//     const alreadyReviewed = home.reviews.find(
//       (r) => r.user && r.user.toString() === userId
//     );

//     if (alreadyReviewed) {
//       return res.status(400).json({
//         msg: "Already reviewed",
//       });
//     }

//     home.reviews.push({
//       user: userId,
//       name: "Guest",
//       rating: Number(rating),
//       comment,
//     });

//     home.totalReviews = home.reviews.length;

//     const totalRating = home.reviews.reduce((sum, r) => sum + r.rating, 0);

//     home.averageRating = Number(
//       (totalRating / home.totalReviews).toFixed(1)
//     );

//     await home.save();

//     res.json({
//       success: true,
//       msg: "Review added",
//       home,
//     });

//   } catch (err) {
//     console.log("inside catch ")
//     console.log(err);
//     res.status(500).json({ msg: "Review failed" });
//   }
// };
exports.addReview = async (req, res) => {
  try {

    const { homeId, userId, rating, comment } = req.body;

    console.log("Review Body:", req.body);

    // find home
    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({ msg: "Home not found" });
    }

    // check booking
    const booking = await Booking.findOne({
      user: userId,
      home: homeId,
      status: "CONFIRMED"
    });

    if (!booking) {
      return res.status(403).json({
        msg: "You can review only after stay"
      });
    }

    // checkout condition
    if (booking.checkOut && new Date(booking.checkOut) > new Date()) {
      return res.status(403).json({
        msg: "Review allowed after checkout"
      });
    }

    // check already reviewed
    const alreadyReviewed = home.reviews.find(
      r => r.user && r.user.toString() === userId
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        msg: "Already reviewed"
      });
    }

    // add review locally
    const newReview = {
      user: userId,
      name: "Guest",
      rating: Number(rating),
      comment
    };

    const updatedReviews = [...home.reviews, newReview];

    // calculate rating
    const totalReviews = updatedReviews.length;

    const totalRating = updatedReviews.reduce(
      (sum, r) => sum + r.rating,
      0
    );

    const averageRating = Number(
      (totalRating / totalReviews).toFixed(1)
    );

    // update home
    await Home.updateOne(
      { _id: homeId },
      {
        reviews: updatedReviews,
        totalReviews: totalReviews,
        averageRating: averageRating
      }
    );

    res.json({
      success: true,
      msg: "Review added"
    });

  } catch (err) {
    console.log("Review Error:", err);
    res.status(500).json({ msg: "Review failed" });
  }
};

 /* ==============================
//    GET SINGLE HOME
// ============================== */
exports.getSingleHome = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ msg: "Home not found" });
    res.json(home);
  } catch {
    res.status(500).json({ msg: "Server error" });
  }
};


exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, booking });
  } catch {
    res.status(500).json({ msg: "Booking failed" });
  }
};


/** for fetch home booked by guest to speccific host  */
// const mongoose = require("mongoose");

// exports.getHostBookings = async (req, res) => {
//   try {
//     const hostId = new mongoose.Types.ObjectId(req.params.hostId);
//      console.log("HOST ID:", req.params.hostId);
//     // find all homes of this host
//     const homes = await Home.find({ hostId: hostId });

//     const homeIds = homes.map(h => h._id);

//     // find bookings of those homes
//     const bookings = await Booking.find({
//       home: { $in: homeIds }
//     })
//     .populate("home")
//     .populate("user", "first_name email")
//     .sort({ createdAt: -1 });

//     res.json(bookings);

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ msg: "Host bookings error" });
//   }
// };

exports.getHostBookings = async (req, res) => {
  try {
    const hostId = req.params.hostId;

    const homes = await Home.find({ hostId });

    const homeIds = homes.map(h => h._id);

    const bookings = await Booking.find({
      home: { $in: homeIds }
    })
    .populate("home")
    .populate("user", "first_name email")
    .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Host bookings error" });
  }
};


exports.getHomeReviews = async (req,res)=>{
 try{

   const home = await Home.findById(req.params.id);

   res.json({
     reviews: home.reviews,
     avgRating: home.averageRating
   });

 }catch(err){
   res.status(500).json({msg:"Error"});
 }
}