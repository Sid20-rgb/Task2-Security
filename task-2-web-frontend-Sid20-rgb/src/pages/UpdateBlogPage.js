import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import "./style.css";

function UpdateBlogPage() {
  const [blogId, setBlogId] = useState(""); // Store the blog ID to update
  const [blogCover, setBlogCover] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const { blogId: blogIdFromParams } = useParams();

  useEffect(() => {
    // Fetch the blog data from the API and store it in state
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/blogs/${blogIdFromParams}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { title, content, blogCover } = response.data;
        setBlogId(blogIdFromParams);
        setTitle(title);
        setContent(content);
        setBlogCover(blogCover);
      } catch (error) {
        setErrorMessage("Error fetching blog data. Please try again.");
        console.log(error);
      }
    };

    fetchBlogData();
  }, []); // Empty dependency array to fetch data only once

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
    if (event.keyCode === 13) {
      event.preventDefault();
      setContent((prevContent) => prevContent + "\n");
    }
  };

  const handleUpdateBlog = (e) => {
    e.preventDefault();

    axios
      .put(
        `http://localhost:3001/blogs/${blogIdFromParams}`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setSuccessMessage("Blog updated successfully.");
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Error updating blog. Please try again.");
      })
      .finally(() => {
        setTimeout(() => {
          setSuccessMessage("");
          setErrorMessage("");
        }, 3000);
      });
  };

  return (
    <div className="flex justify-center">
      <button>
        <FaArrowCircleLeft
          className="absolute z-50 top-3 left-4 text-white w-8 h-8 cursor-pointer transition duration-300 hover:scale-[1.1]"
          onClick={() => window.history.back()}
        />
      </button>

      <div className="w-full max-w-[50rem] py-8 px-12 flex flex-col items-center gap-4 item">
        <h1 className="text-white text-xl font-semibold">Blog Form</h1>

        {successMessage && (
          <div className="text-green-600">{successMessage}</div>
        )}

        {errorMessage && <div className="text-red-600">{errorMessage}</div>}

        <div className="w-56 h-44 border text-white border-white rounded-lg flex flex-col gap-2 items-center justify-center">
          {blogCover && (
            <img
              src={`http://localhost:3001/uploads/${blogCover}`}
              alt="Blog Cover"
              className="w-full h-full object-cover rounded-lg opacity-35 hover:opacity-60 hover:brightness hover:bg-black transition duration-300 ease-in-out"
            />
          )}
        </div>

        <div className="w-full">
          <Input
            type="text"
            placeholder="Type title in here"
            autoFocus
            required
            value={title}
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

        <Button text="Update Blog" onClick={handleUpdateBlog} />
      </div>
    </div>
  );
}

export default UpdateBlogPage;
