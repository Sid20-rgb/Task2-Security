const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const userController = require("../controllers/user-controller");
const { verifyUser } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const passwordRecoveryController = require("../controllers/passwordrecovery-controller");

//User registration
router.post("/register", userController.registerUser);

//User login
router.post("/login", userController.loginUser);

//Get user profile
router.get("/", verifyUser, userController.getUserProfile);

//Update user profile
router.put("/updateProfile", verifyUser, userController.updateUserProfile);

router.get("/users", userController.getAllUsers);

// Get user info from user id
router.get("/:user_id", userController.getUserInfoById);

// Upload image
router.post("/uploadImage", verifyUser, upload, userController.uploadImage);

// Update password
router.put("/change-password", verifyUser, userController.updatePassword);

// Password recovery routes
router.post(
  "/password-recovery/request-password-reset",
  passwordRecoveryController.requestPasswordReset
);
router.post(
  "/password-recovery/reset-password/:token",
  passwordRecoveryController.resetPassword
);

module.exports = router;
