import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { UserContext } from "../context/UserContext";
import "./style.css";
import { useNavigate } from "react-router-dom";

function UploadPage() {
  const [blogCover, setBlogCover] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  const handleblogCoverChange = (event) => {
    const selectedblogCover = event.target.files[0];
    setBlogCover(selectedblogCover);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleContentKeyDown = (event) => {
    // Check if the pressed key is the Enter key (key code: 13)
    if (event.keyCode === 13) {
      event.preventDefault();

      // Add a line break to the content
      setContent((prevContent) => prevContent + "\n");
    }
  };

  const handleAddBlog = async () => {
    try {
      // Upload the book cover first
      const formData = new FormData();
      formData.append("image", blogCover);

      const response = await axios.post(
        "http://localhost:3001/blogs/uploadBlogCover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { filename } = response.data;

      // Add the book with the uploaded book cover
      await axios.post(
        "http://localhost:3001/blogs",
        {
          title,
          content,
          blogCover: filename,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSuccessMessage("Blog uploaded successfully.");
      setTitle("");
      setContent("");
      setBlogCover(null);

      // Hide success message after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage("Error uploading the blog. Please try again.");

      // Hide error message after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <>
      {user ? (
        <div className="flex justify-center">
          <div className="w-full max-w-[50rem] py-8 px-12 flex flex-col items-center gap-4 item">
            <h1 className="text-white text-xl font-semibold">Blog Form</h1>

            {/* Show success message */}
            {successMessage && (
              <div className="text-green-600">{successMessage}</div>
            )}

            {/* Show error message */}
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}

            <div
              className="cursor-pointer w-56 h-44 border text-white border-white rounded-lg flex flex-col gap-2 items-center justify-center px-4"
              onClick={handleUploadClick}
            >
              {!blogCover ? (
                <>
                  <FaUpload className="upload-icon w-10 h-10" />
                  <p className="text-sm">Select the cover image</p>
                </>
              ) : (
                <>
                  <span>{blogCover.name}</span>
                  <p className="text-sm">Selected</p>
                </>
              )}
              <input
                type="file"
                id="blogCover"
                accept="image/*"
                onChange={handleblogCoverChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>

            <div className="w-full">
              <Input
                type="text"
                placeholder="Type title in here"
                autoFocus
                required
                onChange={handleTitleChange}
              />
            </div>

            <div className="w-full">
              <textarea
                id="content"
                rows="5"
                placeholder="Write a blog in here..."
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleContentKeyDown}
              />
            </div>

            <Button text="Upload Blog" onClick={handleAddBlog} />
          </div>
        </div>
      ) : (
        <div
          className="flex min-w-[calc(100vw_-_50px)] md:min-w-[calc(100vw_-_560px)]
        items-center justify-center h-screen bg-gray-800 text-white"
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">404 Error Page</h1>
            <p className="text-lg mb-8">
              Oops! The page you're looking for doesn't exist.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadPage;
