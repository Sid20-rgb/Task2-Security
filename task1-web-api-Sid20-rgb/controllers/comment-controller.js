const Comment = require("../models/comment");
const Blog = require("../models/Blog");
const User = require("../models/User");

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const blogId = req.params.blogId;
    const user = req.user;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const comment = new Comment({
      content,
      user,
      blogId,
      createdAt: Date.now(),
    });

    await comment.save();

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

const deleteComment = async (req, res) => {
  /* istanbul ignore next */
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const userType = user.userType; // Assuming userType is a property in your user object

    // Find the comment by ID
    const comment = await Comment.findById(id);
    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the authenticated user is the owner of the comment or an admin
    if (comment.user.id.toString() !== userId && userType !== "admin") {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this comment" });
    }

    // Find the blog that contains the comment and remove the comment's ID from the comments array
    const blog = await Blog.findByIdAndUpdate(
      comment.blog,
      { $pull: { comments: id } },
      { new: true }
    );

    // Delete the comment
    const deletedComment = await Comment.findByIdAndRemove(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Failed to delete comment" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};

module.exports = {
  createComment,
  deleteComment,
};
