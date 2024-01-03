const mongoose = require("mongoose");
const Blog = require("./Blog");
const Schema = mongoose.Schema;
// const Comment = require("./Comment");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 6,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bookmarkedBlogs: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Blog",
    },
  ],
  // uploadedBlogs: [
  //     {
  //         type: mongoose.SchemaTypes.ObjectId,
  //         ref: 'Blog'
  //     }
  // ]
});

// Add a virtual property to get the count of uploaded blogs
// userSchema.virtual('uploadedBlogsCount', {
//     ref: 'Blog',
//     localField: '_id',
//     foreignField: 'user',
//     count: true
//   });

// set toJSON method to not to return hashed password

userSchema.set("toJSON", {
  transform: (document, returnedDocument) => {
    returnedDocument.id = document._id.toString();
    delete returnedDocument._id;
    delete returnedDocument.password;
    delete returnedDocument.__v;
  },
});

userSchema.pre("remove", async function (next) {
  try {
    await Comment.deleteMany({ userId: this._id }).exec();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = new mongoose.model("User", userSchema);
