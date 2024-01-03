const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blog-controller");
const { verifyUser } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router
  .route("/")
  .get(blogController.getAllBlogs)
  .post(blogController.createBlog)
  .put((req, res) => res.status(405).json({ message: "Method not allowed" }))
  .delete((req, res) =>
    res.status(405).json({ message: "Method not allowed" })
  );

// Upload blog cover
router.post(
  "/uploadBlogCover",
  verifyUser,
  upload,
  blogController.uploadBlogCover
);

// Get blogs uploaded by the current user
router.get(
  "/uploaded-by-current-user",
  verifyUser,
  blogController.getBlogsUploadedByCurrentUser
);

// Get blogs by user id
router.get("/user/:user_id", blogController.getBlogsByUserId);

// Search blogs
router.get("/search", blogController.searchBlogs);

// Search Users
router.get("/searchUser", blogController.searchUsers);

// Get all bookmarked blogs
router.get("/bookmarked-blogs", blogController.getBookmarkedBlogs);

router
  .route("/:blog_id")
  .get(blogController.getBlogById)
  .post((req, res) => {
    res.status(405).json({ error: "POST request is not allowed" });
  })
  .put(blogController.updateBlogById)
  .delete(blogController.deleteBlogById);

// Bookmark a blog
router.post("/bookmark/:blog_id", blogController.bookmarkBlog);

// Remove bookmark from a blog
router.delete("/bookmark/:blog_id", blogController.removeBookmark);

// get users with most blogs sorted in descending order
router.get("/users", blogController.getAllUsers);

module.exports = router;
