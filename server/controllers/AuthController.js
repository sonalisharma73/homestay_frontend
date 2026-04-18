const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const Booking = require('../models/booking');
const redisClient = require("../config/redis");
const nodemailer = require("nodemailer");
const axios = require("axios");
// SIGNUP CONTROLLER
exports.postSignUp = [
  check('first_name')
    .notEmpty().withMessage('First name is required')
    .trim()
    .isLength({ min: 2 }).withMessage('First name must be at least 2 characters')
    .matches(/^[a-zA-Z]+$/).withMessage('First name must contain only letters'),

  check('last_name')
    .optional()
    .trim()
    .matches(/^[a-zA-Z]*$/).withMessage('Last name can only contain letters'),

  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/.*[A-Z].*/).withMessage('Password must contain an uppercase letter')
    .matches(/.*[a-z].*/).withMessage('Password must contain a lowercase letter')
    .matches(/.*\d.*/).withMessage('Password must contain a number')
    .matches(/.*[!@#$%^&*(),.?":{}|<>].*/).withMessage('Password must contain a special character'),

  check('confirmpassword')
    .notEmpty().withMessage('Please confirm your password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('userType')
    .notEmpty().withMessage('Please select a user type')
    .isIn(['host', 'guest']).withMessage('Invalid user type'),


  check('terms')
    .custom((value) => value === true)
    .withMessage('You must accept the terms and conditions'),

  async (req, res) => {
    try {
      const { first_name, last_name, email, password, userType } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, msg: "Validation failed", errors: errors.array() });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).json({ success: false, msg: "Email is already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ first_name, last_name, email, password: hashedPassword, userType });
      await user.save();

      return res.status(201).json({ success: true, msg: "Signup successful! Please login." });
    } catch (err) {
      console.error("Error in signup:", err);
      return res.status(500).json({ success: false, msg: "Server error" });
    }
  }
];

//  LOGIN
exports.postLogin = async (req, res) => {

  try {
    console.log("Login attempt:", req.session.isLoggedIn); // Debug log
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(422).json({ success: false, msg: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(422).json({ success: false, msg: "Invalid password" });
    }

    // 🔵 role choose by user (guest or host)
    const loginRole = role || user.userType;

    // ✅ SAVE SESSION
    req.session.isLoggedIn = true;
    req.session.userId = user._id;
    req.session.role = loginRole;
    req.session.user = user;

    await req.session.save();

    return res.json({
      success: true,
      msg: "Login successful",
      role: loginRole,
      userId: user._id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
};


//✅ LOGOUT
exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, msg: "Logged out" });
  });
};

// // ✅ RESET PASSWORD
// exports.postResetPassword = async (req, res) => {
//   try {
//     const { email, password, confirmPassword } = req.body;

//     if (!email || !password || !confirmPassword) {
//       return res.status(400).json({ success: false, msg: "All fields are required" });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({ success: false, msg: "Passwords do not match" });
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         success: false,
//         msg: "Password must be at least 8 chars, include uppercase, lowercase, number, and special character",
//       });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, msg: "User not found" });
//     }

//     user.password = await bcrypt.hash(password, 12);
//     await user.save();

//     return res.json({ success: true, msg: "Password reset successful" });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, msg: "Server error" });
//   }
// };






// GET USER
exports.getUserById = async (req,res)=>{
  const user = await User.findById(req.params.id);
  res.json(user);
};

// UPDATE PROFILE
exports.updateProfile = async (req,res)=>{
  try{
    const user = await User.findById(req.params.id);

    user.first_name = req.body.first_name;

    if(req.file){
      user.profilePic = "uploads/" + req.file.filename;
    }

    await user.save();
    res.json(user);

  }catch{
    res.status(500).json({msg:"Update failed"});
  }
};

// USER STATS


exports.getUserProfile = async (req,res)=>{
  try{
    const user = await User.findById(req.params.id);
    res.json(user);
  }catch{
    res.status(500).json({msg:"error"});
  }
};

// exports.getUserStats = async (req,res)=>{
//   const bookings = await Booking.find({ user:req.params.id });

//   const totalBookings = bookings.length;
//   const totalSpent = bookings.reduce(
//     (sum,b)=> sum + (b.finalPrice || 0),0
//   );

//   res.json({ totalBookings, totalSpent });
// };

exports.getUserStats = async (req, res) => {
  try {

    const bookings = await Booking.find({ user: req.params.id });

    const totalBookings = bookings.length;

    const cancelledBookings = bookings.filter(
      b => b.status === "CANCELLED"
    ).length;

    const completedBookings = bookings.filter(
      b => b.status === "CONFIRMED"
    ).length;

    // ❗ Do not count cancelled bookings in spending
    const totalSpent = bookings
      .filter(b => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + (b.finalPrice || 0), 0);

    res.json({
      totalBookings,
      completedBookings,
      cancelledBookings,
      totalSpent
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Stats error" });
  }
};

const multer = require("multer");

/* ========= IMAGE UPLOAD ========= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

exports.upload = multer({ storage });

/* ========= UPDATE PROFILE ========= */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const updateData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
    };

    if (req.file) {
      updateData.profilePic = `uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Profile update failed" });
  }
};




exports.checkAuth = (req, res) => {
  if (req.session.isLoggedIn) {
    return res.json({
      loggedIn: true,
      userId: req.session.userId,
      role: req.session.role
    });
  }

  return res.json({ loggedIn: false });
};





exports.sendOtp = async (req, res) => {
  console.log("==== SEND OTP START ====");
  console.log("Request Body:", req.body);

  try {
    const { email, PhoneNo } = req.body;

    // -------- CHECK USER --------
    console.log("Checking existing user...");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ msg: "Email already exists" });
    }

    // -------- PHONE VALIDATION --------
    if (!/^[0-9]{10}$/.test(PhoneNo)) {
      console.log("Invalid phone");
      return res.status(400).json({ msg: "Invalid phone number" });
    }

    // -------- REDIS RATE LIMIT --------
    try {
      console.log("Checking Redis rate limit...");
      const limit = await redisClient.get(`otp-limit:${email}`);
      console.log("Redis limit:", limit);

      if (limit) {
        return res.status(429).json({ msg: "Wait 60 sec before retry" });
      }

      await redisClient.set(`otp-limit:${email}`, "1", { EX: 60 });
    } catch (err) {
      console.error("REDIS ERROR:", err);
      return res.status(500).json({ msg: "Redis failed" });
    }

    // -------- GENERATE OTP --------
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("Generated OTPs:", { emailOtp, phoneOtp });

    // -------- STORE OTP --------
    try {
      await redisClient.set(`otp:email:${email}`, emailOtp, { EX: 300 });
      await redisClient.set(`otp:phone:${PhoneNo}`, phoneOtp, { EX: 300 });
    } catch (err) {
      console.error("REDIS STORE ERROR:", err);
      return res.status(500).json({ msg: "Redis store failed" });
    }

    // -------- EMAIL CONFIG --------
    console.log("Email ENV:", process.env.EMAIL_USER, process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // -------- SEND EMAIL --------
    try {
      console.log("Sending email...");
      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification",
        text: `Your Email OTP is ${emailOtp}`,
      });

      console.log("MAIL SENT:", info.response);
    } catch (err) {
      console.error("MAIL ERROR:", err);
      return res.status(500).json({ msg: err.message });
    }

    // open for sms otp for that fast2sms paid version is required 

//     console.log("Phone OTP:", phoneOtp);
//     try {  console.log("Phone OTP2:", phoneOtp);
//   await axios.post(
//     "https://www.fast2sms.com/dev/bulkV2",
//     {
//       variables_values: phoneOtp,
//       route: "otp",
//       numbers: PhoneNo,
//     },
//     {
//       headers: {
//         authorization: process.env.FAST2SMS_API_KEY,
//       },
//     }
//   );

//   console.log("SMS sent successfully");
// } catch (err) {
//   console.error("SMS ERROR:", err.response?.data || err.message);
// }

    console.log("==== SEND OTP SUCCESS ====");
    res.json({ success: true, msg: "OTP sent" });

  } catch (err) {
    console.error("FINAL ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ======================= VERIFY OTP =======================
exports.verifyOtpAndSignup = async (req, res) => {
  console.log("==== VERIFY OTP START ====");
  console.log("Request Body:", req.body);

  try {
    const {
      email,
      PhoneNo,
      otp,
      password,
      first_name,
      last_name,
      userType
    } = req.body;

    // -------- ATTEMPT LIMIT --------
    try {
      const attempts = await redisClient.incr(`otp-attempt:${email}`);
      console.log("Attempts:", attempts);

      if (attempts > 3) {
        return res.status(429).json({ msg: "Too many attempts" });
      }

      await redisClient.expire(`otp-attempt:${email}`, 300);
    } catch (err) {
      console.error("REDIS ATTEMPT ERROR:", err);
      return res.status(500).json({ msg: "Redis error" });
    }

    // -------- GET OTP --------
    let emailOtp, phoneOtp;
    try {
      emailOtp = await redisClient.get(`otp:email:${email}`);
      phoneOtp = await redisClient.get(`otp:phone:${PhoneNo}`);
      console.log("Stored OTPs:", { emailOtp, phoneOtp });
    } catch (err) {
      console.error("REDIS GET ERROR:", err);
      return res.status(500).json({ msg: "Redis fetch failed" });
    }

    if (!emailOtp || !phoneOtp) {
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (otp !== emailOtp && otp !== phoneOtp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // -------- DELETE OTP --------
    await redisClient.del(`otp:email:${email}`);
    await redisClient.del(`otp:phone:${PhoneNo}`);

    // -------- HASH PASSWORD --------
    const hashedPassword = await bcrypt.hash(password, 12);

    // -------- SAVE USER --------
    const user = new User({
      email,
      PhoneNo,
      password: hashedPassword,
      first_name,
      last_name,
      userType
    });

    await user.save();

    console.log("==== SIGNUP SUCCESS ====");
    res.json({ success: true, msg: "Signup successful" });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};













// ================= RESET PASSWORD FLOW =================

// 1. SEND OTP
exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.set(`reset:otp:${email}`, otp, { EX: 300 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      html: `<h3>Your OTP is <b>${otp}</b></h3>`,
    });

    res.json({ success: true, msg: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Failed to send OTP" });
  }
};


// 2. VERIFY OTP
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redisClient.get(`reset:otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({ success: false, msg: "OTP expired" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ success: false, msg: "Invalid OTP" });
    }

    // ✅ mark verified
    await redisClient.set(`reset:verified:${email}`, "true", { EX: 300 });

    res.json({ success: true, msg: "OTP verified" });

  } catch (err) {
    res.status(500).json({ success: false, msg: "Error verifying OTP" });
  }
};


// 3. RESET PASSWORD
exports.postResetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    const verified = await redisClient.get(`reset:verified:${email}`);
    if (!verified) {
      return res.status(400).json({ success: false, msg: "Verify OTP first" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, msg: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();

    // cleanup
    await redisClient.del(`reset:otp:${email}`);
    await redisClient.del(`reset:verified:${email}`);

    res.json({ success: true, msg: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};








// ================= RESET PASSWORD FLOW =================

// 1. SEND OTP
exports.sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.set(`reset:otp:${email}`, otp, { EX: 300 });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      html: `<h3>Your OTP is <b>${otp}</b></h3>`,
    });

    res.json({ success: true, msg: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Failed to send OTP" });
  }
};


// 2. VERIFY OTP
exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redisClient.get(`reset:otp:${email}`);

    if (!storedOtp) {
      return res.status(400).json({ success: false, msg: "OTP expired" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ success: false, msg: "Invalid OTP" });
    }

    // ✅ mark verified
    await redisClient.set(`reset:verified:${email}`, "true", { EX: 300 });

    res.json({ success: true, msg: "OTP verified" });

  } catch (err) {
    res.status(500).json({ success: false, msg: "Error verifying OTP" });
  }
};


// 3. RESET PASSWORD
exports.postResetPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    const { password, confirmPassword } = req.body;

    const verified = await redisClient.get(`reset:verified:${email}`);

    if (!verified) {
      return res.status(400).json({ msg: "Verify OTP first" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // ✅ FIX HERE
    await User.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    await redisClient.del(`reset:otp:${email}`);
    await redisClient.del(`reset:verified:${email}`);

    res.json({ success: true, msg: "Password reset successful" });

  } catch (err) {
    console.error("🔥 RESET ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};