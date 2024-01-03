const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  User.findOne({ username: username })
    .then((user) => {
      if (user) return res.status(400).json({ error: "Duplicate username" });

      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: err.message });

        User.create({ username, email, password: hash })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch(next);
      });
    })
    .catch(next);
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then((user) => {
      if (!user)
        return res.status(400).json({ error: "User is not registered" });

      bcrypt.compare(password, user.password, (err, success) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!success)
          /* istanbul ignore next */
          return res.status(400).json({ error: "Password does not match" });

        const payload = {
          id: user._id,
          username: user.username,
          email: user.email,
        };

        jwt.sign(
          payload,
          process.env.SECRET,
          { expiresIn: "30d" },
          (err, token) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ status: "success", token: token });
          }
        );
      });
    })
    .catch(next);
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
      /* istanbul ignore next */
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

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;

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
