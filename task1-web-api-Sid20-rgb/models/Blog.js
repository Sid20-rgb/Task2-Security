const mongoose = require("mongoose");
const User = require("./User");
const Comment = require("./comment");

// Define the Blog schema
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  contentImg: {
    type: [String],
    required: [true, "Please upload a content image"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.Mixed,
    ref: "User",
    // required: true
  },
  blogCover: {
    type: String,
    required: [true, "Please upload a cover image"],
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],

  // user: [userSchema]
});

// Create the Blog model
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
