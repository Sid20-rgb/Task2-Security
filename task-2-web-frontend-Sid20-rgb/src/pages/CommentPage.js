import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaRegComment, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./cmmtstyle.css";

const CommentPage = ({ comments, onDeleteComment, setComments, blog }) => {
  const [commentOwners, setCommentOwners] = useState({});

  console.log(blog);

  // Function that fetches comment owner's data
  // This function is called inside useEffect hook
  const fetchCommentOwner = async (commentOwnerId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${commentOwnerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Comment owner data retrieved successfully");
        return response.data;
      } else {
        console.log("Failed to retrieve comment owner data");
      }
    } catch (error) {
      console.log("Failed to retrieve comment owner data", error);
    }
  };

  useEffect(() => {
    // Fetch comment owners' data and store it in state
    const fetchCommentOwnersData = async () => {
      const ownersData = {};
      for (const comment of comments) {
        if (!ownersData[comment.user.id]) {
          ownersData[comment.user.id] = await fetchCommentOwner(
            comment.user.id
          );
        }
      }
      setCommentOwners(ownersData);
    };
    fetchCommentOwnersData();
  }, [comments]);

  const handleDeleteComment = async (commentId) => {
    console.log("Deleting comment", commentId);
    try {
      const response = await axios.delete(
        `http://localhost:3001/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Comment deleted successfully");
        onDeleteComment(commentId); // Notify parent component to update comments state

        // Remove the deleted comment from the local storage
        const updatedBlogData = {
          ...blog,
          comments: comments.filter((comment) => comment._id !== commentId),
        };
        localStorage.setItem("blogData", JSON.stringify(updatedBlogData));
      } else {
        console.log("Failed to delete comment");
        // Optionally, you can display an error message to the user
      }
    } catch (error) {
      console.log("Failed to delete comment", error);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div className="comment-section">
      {comments.length === 0 && <p className="text-center">No comments yet</p>}
      {comments.map((comment, index) => (
        <div className="border-b flex items-center justify-between" key={index}>
          <div className="comment">
            <img
              src={
                commentOwners[comment.user.id]?.image == null
                  ? "https://img.freepik.com/free-icon/user_318-159711.jpg"
                  : `http://localhost:3001/uploads/${
                      commentOwners[comment.user.id]?.image
                    }`
              }
              alt="User"
              className="user-image"
            />

            <div>
              <h4 className="username">
                {commentOwners[comment.user.id]?.username}
              </h4>
              <p className="date">{comment.createdAt.substring(0, 10)}</p>
              <p className="comment-text">{comment.content}</p>
            </div>
          </div>

          {comment.isCommentOwner && (
            <FaTrash
              className="cursor-pointer text-xl"
              onClick={() => handleDeleteComment(comment._id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const CommentApp = () => {
  const blog = JSON.parse(localStorage.getItem("blogData"));
  console.log(blog);
  const [comments, setComments] = useState(blog.comments);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();

  // Function to update comments state after deleting a comment
  const handleDeleteComment = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== commentId)
    );
  };

  // Function to add a new comment
  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/comments/${blog._id}`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newCommentData = response.data;
      if (!newCommentData.hasOwnProperty("isCommentOwner")) {
        newCommentData.isCommentOwner = true;
      }

      // Update the local storage data for the blog
      const updatedBlogData = {
        ...blog,
        comments: [...comments, newCommentData],
      };
      localStorage.setItem("blogData", JSON.stringify(updatedBlogData));

      if (response.status === 201) {
        console.log("Comment added successfully");
        setComments([...comments, response.data]); // Update the UI with the new comment
        setNewComment(""); // Clear the input field
      } else {
        console.log("Failed to add comment");
        // Optionally, you can display an error message to the user
      }
    } catch (error) {
      console.log("Failed to add comment", error);
      // Optionally, you can display an error message to the user
    }
  };

  useEffect(() => {
    setComments(blog.comments); // Update comments state when the blog changes (e.g., when navigating from another page)
  }, [blog]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddComment();
    }
  };

  return (
    <div className="app">
      <div className="bg-[#1F2937] fixed top-0 left-0 w-full border-b px-8 py-4">
        <div className="comment-form flex items-center gap-4 my-0">
          <FaArrowLeft
            className="cursor-pointer text-2xl text-white"
            onClick={() => {
              navigate(`/blogDetails`);
            }}
          />

          <h1 className="comment-section-title">Comment Section</h1>
        </div>
      </div>

      <div className="mt-[3rem]">
        {/* Pass comments, the handleDeleteComment function, setComments, and blog data as props */}
        <CommentPage
          comments={comments}
          onDeleteComment={handleDeleteComment}
          setComments={setComments}
          blog={blog}
        />

        <div className="flex items-center justify-center mx-5 bg-white pr-2">
          <input
            type="text"
            placeholder="Say something..."
            autoFocus
            required
            value={newComment}
            className="px-4 py-2 w-full border-none outline-none"
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <FaRegComment
            className="cursor-pointer text-2xl text-black"
            onClick={handleAddComment}
          />
        </div>
      </div>
    </div>
  );
};

export default CommentApp;
