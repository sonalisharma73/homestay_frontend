const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/BookingController");

/* ===============================
   BASIC ROUTES (OLD SAFE)
================================= */

// Get single home details
router.get("/home/:id", bookingController.getSingleHome);

// Check room availability
router.post("/check", bookingController.checkAvailability);

// OLD create route (optional - keep if needed)
router.post("/create", bookingController.createBooking);


/* ===============================
   NEW PAYMENT ROUTES
================================= */

// 1️⃣ Create Razorpay order (ONLINE payment)
router.post("/pay", bookingController.createPaymentOrder);

// 2️⃣ Verify Razorpay payment & confirm booking
router.post("/verify", bookingController.verifyPayment);

// 3️⃣ COD booking (direct confirm)
router.post("/cod", bookingController.createCODBooking);

router.put("/complete/:id", bookingController.completeBooking);
/* ===============================
   OPTIONAL EXTRA FEATURES
================================= */



// Get bookings by user

router.get("/reviews/:id", bookingController.getHomeReviews);
router.get("/host-bookings/:hostId", bookingController.getHostBookings);
router.get("/my-bookings/:userId", bookingController.getUserBookings);
router.put("/cancel/:id", bookingController.cancelBooking);
router.post("/review", bookingController.addReview);

module.exports = router;