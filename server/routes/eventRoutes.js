const express = require("express");
const router = express.Router();
const eventController = require("../controllers/EventController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Ensure uploads folder exists
const uploadPath = "uploads/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ✅ STORAGE CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// ✅ FILE FILTER (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (
    allowedTypes.test(ext) &&
    allowedTypes.test(mime)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// ✅ MULTER CONFIG
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB per file
  },
  fileFilter
});

// ✅ ADD EVENT
router.post(
  "/add-event",
  upload.array("images", 5), // max 5 images
  eventController.addEvent
);

// ✅ GET EVENTS
router.get("/events", eventController.getEvents);
router.get("/:id", eventController.SingleEvents);




module.exports = router;