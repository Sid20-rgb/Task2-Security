const mongoose = require("mongoose");
const User = require("./User");

const commentSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.Mixed,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// commentSchema.virtual("user", {
//   ref: "User",
//   localField: "user",
//   foreignField: "_id",
//   justOne: true,
// });

// commentSchema.set("toObject", { virtuals: true });
// commentSchema.set("toJSON", { virtuals: true });

// commentSchema.populate('userId');

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
