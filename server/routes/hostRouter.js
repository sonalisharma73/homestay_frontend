const express = require("express");
const multer = require("multer");
const hostController = require("../controllers/hostController");
const hostRouter = express.Router();
const fs = require("fs");
const path = require("path");


const uploadDir = path.join(__dirname, "..", "uploads");

// create uploads folder if not exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Uploads folder created!");
}

/* ================= MULTER ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage, fileFilter });

/* ================= ROUTES ================= */

/* 🔥 ADD HOME */
hostRouter.post(
  "/add-home",
  upload.fields([
    { name: "photos", maxCount: 10 },        // multiple home photos
    { name: "idProofImage", maxCount: 1 },   // owner id proof
  ]),
  hostController.postHomeAdd
);

/* GET ALL */
hostRouter.get("/host-home-list", hostController.getHostHome);

/* GET SINGLE FOR EDIT */
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);

/* 🔥 EDIT HOME */
hostRouter.post(
  "/edit-home",
  upload.fields([
    { name: "photos", maxCount: 10 },
    { name: "idProofImage", maxCount: 1 },
  ]),
  hostController.postEditHome
);

/* DELETE */
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

/* ================= HOST DASHBOARD ================= */

// Get all bookings for this host
// hostRouter.get(
//   "/bookings",
//   hostController.getHostBookings
// );

// Update booking status (Approve / Reject)
hostRouter.put(
  "/booking-status/:id",
  hostController.updateBookingStatus
);

// Get dashboard stats
hostRouter.get("/stats/:id", hostController.getHostStats);

// Get host profile
hostRouter.get(
  "/profile",
  hostController.getHostProfile
);


// events 

// MY EVENTS
hostRouter.get("/my-events", hostController.getMyEvents);

// DELETE
hostRouter.delete("/eventdelete/:id", hostController.deleteEvent);

// UPDATE
hostRouter.put(
  "/update-event/:id",
  upload.array("images", 10), // ⭐ YEH ADD KARNA HAI
  hostController.updateEvent
);


module.exports = hostRouter;
