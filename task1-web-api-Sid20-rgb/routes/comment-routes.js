const express = require("express");
const {
  createComment,
  deleteComment,
  getCommentById,
} = require("../controllers/comment-controller");
const { verifyUser } = require("../middlewares/auth");

const commentRouter = express.Router();

commentRouter.post("/:blogId", createComment);
commentRouter.delete("/:id", verifyUser, deleteComment);
// commentRouter.get('/:id', getCommentById);
// commentRouter.put('/:id', auth, updateComment);

module.exports = commentRouter;
