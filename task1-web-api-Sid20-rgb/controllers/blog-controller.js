const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const User = require("../models/User");

const getAllBlogs = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.id;
    const userInfo = await User.findById(loggedInUserId);
    const blogs = await Blog.find().populate("comments");

    const otherBlogs = blogs.map((blog) => {
      const isBookmarked = userInfo.bookmarkedBlogs.includes(
        blog.id.toString()
      );

      const commentsWithOwnership = blog.comments.map((comment) => {
        const isCommentOwner = comment.user.id.toString() === loggedInUserId;
        return {
          ...comment.toObject(),
          isCommentOwner: isCommentOwner,
        };
      });

      return {
        ...blog.toObject(),
        comments: commentsWithOwnership, // Replace comments with commentsWithOwnership
        isBookmarked: isBookmarked,
      };
    });

    res.json({
      data: otherBlogs,
    });
  } catch (error) {
    next(error);
  }
};

// Get blogs by user id
const getBlogsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.user_id;

    const blogs = await Blog.find({ "user.id": userId }).sort({
      createdAt: -1,
    });

    res.json({
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

/* istanbul ignore next */
const createBlog = async (req, res, next) => {
  const { title, content } = req.body;
  const user = req.user;

  // Use the uploadedFilename from the shared variable
  const blogCover = uploadedFilename || "";

  try {
    if (!title || !content) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const blogData = {
      title,
      content,
      blogCover,
      user: user,
    };

    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  } finally {
    uploadedFilename = undefined; // Reset the shared variable after use
  }
};

/* istanbul ignore next */
const uploadBlogCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    // Save the book cover image and get the filename
    const filename = req.file.filename;

    uploadedFilename = filename; // Store the filename in the shared variable

    res.status(200).json({ success: true, data: filename });
  } catch (error) {
    next(error);
  }
};

const getBlogById = (req, res, next) => {
  Blog.findById(req.params.blog_id)
    .then((blog) => {
      if (!blog) {
        res.status(404).json({ error: "blog not found" });
      }
      res.json(blog);
    })
    .catch(next);
};

const updateBlogById = (req, res, next) => {
  Blog.findByIdAndUpdate(req.params.blog_id, { $set: req.body }, { new: true })
    .then((updated) => res.json(updated))
    .catch(next);
};

const deleteBlogById = (req, res, next) => {
  Blog.findByIdAndDelete(req.params.blog_id)
    .then((reply) => res.status(204).end())
    .catch(next);
};

const searchBlogs = (req, res, next) => {
  const { query } = req.query;

  Blog.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      // { author: { $regex: query, $options: "i" } },
    ],
  })
    .then((blogs) => {
      if (blogs.length === 0) {
        /* istanbul ignore next */
        res.status(404).json({ message: "No blogs found" });
      } else {
        // Matching blogs found
        res.json(blogs);
      }
    })
    .catch((error) => {
      /* istanbul ignore next */
      next(error);
    });
};

const searchUsers = (req, res, next) => {
  const { query } = req.query;

  User.find({
    $or: [
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ],
  })
    .then((users) => {
      if (users.length === 0) {
        /* istanbul ignore next */
        res.json({ message: "No users found" });
      } else {
        // Matching users found
        res.json(users);
      }
    })
    .catch((error) => {
      /* istanbul ignore next */
      next(error);
    });
};

const bookmarkBlog = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blog_id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.bookmarkedBlogs.includes(blogId)) {
      return res.status(400).json({ error: "Blog is already bookmarked" });
    }

    user.bookmarkedBlogs.push(blogId);
    await user.save();

    res.json({ message: "Blog bookmarked successfully" });
  } catch (error) {
    next(error);
  }
};

const removeBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blog_id;

    const user = await User.findById(userId);
    if (!user) {
      /* istanbul ignore next */
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.bookmarkedBlogs.includes(blogId)) {
      /* istanbul ignore next */
      return res.status(400).json({ error: "Blog is not bookmarked" });
    }

    user.bookmarkedBlogs = user.bookmarkedBlogs.filter(
      (bookmark) => bookmark.toString() !== blogId
    );
    await user.save();

    res.json({ message: "Blogmark removed successfully" });
  } catch (error) {
    next(error);
  }
};

const getBookmarkedBlogs = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookmarkedBlogs = await Blog.find({
      _id: { $in: user.bookmarkedBlogs },
    });

    res.json({ data: bookmarkedBlogs });
  } catch (error) {
    next(error);
  }
};

// Get books uploaded by current user
const getBlogsUploadedByCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const books = await Blog.find({ "user.id": userId }).sort({
      createdAt: -1,
    });

    res.json({
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// get users with most blogs sorted in descending order
/* istanbul ignore next */
const getAllUsers = async (req, res, next) => {
  try {
    // Use aggregation to get all users and count the number of uploaded blogs for each user
    const users = await User.aggregate([
      {
        $lookup: {
          from: "blogs", // The name of the collection for the Blog model
          localField: "_id", // Use the correct local field (_id field in the User model)
          foreignField: "user", // Use the correct foreign field (user field in the Blog model)
          as: "uploadedBlogsData",
        },
      },
      {
        $addFields: {
          uploadedBlogsCount: { $size: "$uploadedBlogsData" },
        },
      },
      {
        $sort: { uploadedBlogsCount: -1 }, // Sort users based on the uploadedBlogsCount in descending order
      },
    ]);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  uploadBlogCover,
  getBlogById,
  updateBlogById,
  deleteBlogById,
  searchBlogs,
  searchUsers,
  getBlogsUploadedByCurrentUser,
  bookmarkBlog,
  removeBookmark,
  getBookmarkedBlogs,
  getAllUsers,
  getBlogsByUserId,
};
