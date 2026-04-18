 // Core Modules
const path = require('path');

// External Modul
const express = require('express');
const AuthRouter = express.Router();

// Local Module

const Authcontroler=require('../controllers/AuthController');
AuthRouter.post("/login",Authcontroler.postLogin);
AuthRouter.post("/logout",Authcontroler.postLogout);
AuthRouter.post("/send-reset-otp", Authcontroler.sendResetOtp);
AuthRouter.post("/verify-reset-otp", Authcontroler.verifyResetOtp);
AuthRouter.post("/reset_password", Authcontroler.postResetPassword);
AuthRouter.post("/SignUp",Authcontroler.postSignUp);
AuthRouter.get("/user/:id", Authcontroler.getUserById);
AuthRouter.put("/user/:id", Authcontroler.updateProfile);
AuthRouter.get("/stats/:id", Authcontroler.getUserStats);
AuthRouter.get("/profile/:id", Authcontroler.getUserProfile);
AuthRouter.post("/send-otp", Authcontroler.sendOtp);
AuthRouter.post("/verify-otp", Authcontroler.verifyOtpAndSignup);

AuthRouter.put(
  "/update-profile/:userId",
  Authcontroler.upload.single("profilePic"),
  Authcontroler.updateProfile
);
AuthRouter.get("/check-auth", Authcontroler.checkAuth);
module.exports = AuthRouter;