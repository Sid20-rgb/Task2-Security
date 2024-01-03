const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

const registerUser = async (req, res, next) => {
  console.log("Request Body:", req.body);

  const { username, password, email } = req.body;

  try {
    // Check for empty fields
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }

    // Check for password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}[\]:;<>,.?~\\-])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must include combination of: Uppercase letters, Lowercase letters, Numbers, Special characters (e.g.,!, @, #, $)",
      });
    }

    // Check for password length
    const minLength = 8;
    if (password.length < minLength) {
      return res.status(400).json({
        error: `Password length should be at least ${minLength} characters.`,
      });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({ error: "Duplicate username" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ status: "success", message: "User created" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (!username || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    
    if (!user) {
      return res.status(400).json({ error: "User is not registered" });
    }

  

    // Check if the account is locked
    if (user.accountLocked) {
      // Check if it's time to unlock the account
      const lockoutDurationMillis = Date.now() - user.lastFailedLoginAttempt;
      const lockoutDurationMinutes = lockoutDurationMillis / (60 * 1000); // convert to minutes

      if (lockoutDurationMinutes >= 2) {
        // Unlock the account
        user.accountLocked = false;
        user.failedLoginAttempts = 0;
        await user.save();
      } else {
        return res
          .status(400)
          .json({ error: "Account is locked. Please try again later." });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts and update last failed login timestamp
      user.failedLoginAttempts += 1;
      user.lastFailedLoginAttempt = Date.now();

      // Check if the maximum allowed failed attempts is reached
      if (user.failedLoginAttempts >= 4) {
        // Lock the account
        user.accountLocked = true;
        await user.save();
        return res
          .status(400)
          .json({ error: "Account is locked. Please try again later." });
      }

      // Save the updated user data
      await user.save();

      return res.status(400).json({ error: "Password does not match" });
    }

    // Reset failed login attempts and last failed login timestamp on successful login
    user.failedLoginAttempts = 0;
    user.lastFailedLoginAttempt = null;
    await user.save();

    // Check if the account is still locked after successful login
    if (user.accountLocked) {
      return res
        .status(400)
        .json({ error: "Account is locked. Please try again later." });
    }

    // If everything is fine, generate and send the JWT token
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        /* istanbul ignore next */
        return res.status(500).json({ error: err.message });
      }
      res.json({ status: "success", token: token });
    });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const getUserProfile = (req, res, next) => {
  const userId = req.user.id;

  User.findById(userId)
    .then((user) => {
      /* istanbul ignore next */
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ data: [user] });
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user.id;
  const { username, fullname, email, location } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        /* istanbul ignore next */
        return res.status(404).json({ error: "User not found" });
      }

      // Update the fields only if they are different from the existing values
      if (username && username !== "" && username !== user.username) {
        user.username = username;
      }
      if (email && email !== "" && email !== user.email) {
        user.email = email;
      }

      // Save the updated user
      user
        .save()
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch(next);
    })
    .catch(next);
};

const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the stored hashed password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "New password and confirm password do not match" });
    }

    // Check if the new password is different from the current password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        error: "New password must be different from the current password",
      });
    }

    // Check if the user's password needs to be expired
    const passwordChangeDate = user.passwordChangeDate || user.createdAt;
    const passwordExpiryDays = 90; // Change password every 90 days

    const lastPasswordChange = new Date(passwordChangeDate);
    const currentDate = new Date();

    const daysSinceLastChange = Math.floor(
      (currentDate - lastPasswordChange) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastChange > passwordExpiryDays) {
      return res.status(400).json({
        error: `Your password has expired. Please change your password.`,
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and set the new password change date
    user.password = hashedNewPassword;
    user.passwordChangeDate = currentDate;

    // Save the updated user
    await user.save();

    res.status(204).json({ message: "Password updated successfully" });
  } catch (error) {
    /* istanbul ignore next */
    next(error);
  }
};

const getUserInfoById = async (req, res, next) => {
  const userId = req.params.user_id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      /* istanbul ignore next */
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ data: users });
  } catch (error) {
    next(error);
  }
};

/* istanbul ignore next */
const uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a file" });
  }

  // Update the user's profile picture in the database
  const userId = req.user.id;
  const image = req.file.filename;

  User.findByIdAndUpdate(userId, { image })
    .then(() => {
      res.status(200).json({
        success: true,
        data: image,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to update the user's profile picture",
      });
    });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserInfoById,
  getAllUsers,
  uploadImage,
  updatePassword,
};
