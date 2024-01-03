import axios from "axios";
import React, { useEffect, useState } from "react";
import ChangePassword from "./ChangePassword";
import "./update.css"; // Import the CSS file for styles

const UpdateProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [pictureSuccessMessage, setPictureSuccessMessage] = useState("");
  const [pictureErrorMessage, setPictureErrorMessage] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/users", // Replace with your API endpoint for fetching user profile
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          const userData = response.data;
          // console.log(userData);
          setUsername(userData?.data[0].username);
          setEmail(userData?.data[0].email);
          setProfilePicture(userData?.data[0].image);
          // Optionally, you can update the profileImage state if you want to display the user's profile image fetched from the API
        } else {
          console.log("Failed to fetch user profile");
          // Optionally, you can display an error message to the user
        }
      } catch (error) {
        console.log("Failed to fetch user profile", error);
        // Optionally, you can display an error message to the user
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/users/uploadImage", // Replace with your API endpoint for uploading the profile picture
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("Profile picture uploaded successfully");
        // Fetch the updated user data after uploading the new photo
        const updatedUserResponse = await axios.get(
          "http://localhost:3001/users", // Replace with your API endpoint for fetching user profile
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const updatedUserData = updatedUserResponse.data;
        setUsername(updatedUserData.username);
        setEmail(updatedUserData.email);
        setProfilePicture(updatedUserData.image);
        // Optionally, you can update the profileImage state if you want to display the user's updated profile image

        setPictureSuccessMessage("Profile picture uploaded successfully!");
        setTimeout(() => {
          setPictureSuccessMessage("");
        }, 5000); // Remove the success message after 5 seconds
      } else {
        console.log("Failed to upload profile picture");
        setPictureErrorMessage("Failed to upload profile picture");
        setTimeout(() => {
          setPictureErrorMessage("");
        }, 5000); // Remove the error message after 5 seconds
      }
    } catch (error) {
      console.log("Failed to upload profile picture", error);
      setPictureErrorMessage("Failed to upload profile picture");
      setTimeout(() => {
        setPictureErrorMessage("");
      }, 5000); // Remove the error message after 5 seconds
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:3001/users/updateProfile", // Replace with your API endpoint for updating user profile
        {
          username: username,
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("User profile updated successfully:", response.data);
        setProfileSuccessMessage("User profile updated successfully!");
        setTimeout(() => {
          setProfileSuccessMessage("");
        }, 5000); // Remove the success message after 5 seconds
      } else {
        console.log("Failed to update user profile");
        setProfileErrorMessage("Failed to update user profile");
        setTimeout(() => {
          setProfileErrorMessage("");
        }, 5000); // Remove the error message after 5 seconds
      }
    } catch (error) {
      console.log("Failed to update user profile", error);
      setProfileErrorMessage("Failed to update user profile");
      setTimeout(() => {
        setProfileErrorMessage("");
      }, 5000); // Remove the error message after 5 seconds
    }
  };

  return (
    <div className="flex flex-col items-center text-white">
      <div className="left-side flex flex-col items-center ">
        <form>
          <div>
            <div className="flex flex-col items-center">
              <label htmlFor="profile-image">
                <img
                  id="profile-img"
                  src={`http://localhost:3001/uploads/${profilePicture}`}
                  alt="Profile"
                  className="w-28 h-28 rounded-full cursor-pointer mb-2"
                />
              </label>
              <input
                type="file"
                id="profile-image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <div className="ml-2 ">
                <h3 className="font-bold text-center">{username}</h3>
                <p className="text-gray-500 text-center">{email}</p>
              </div>
              {pictureSuccessMessage && (
                <p className="text-green-500 mt-2">{pictureSuccessMessage}</p>
              )}
              {pictureErrorMessage && (
                <p className="text-red-500 mt-2">{pictureErrorMessage}</p>
              )}
            </div>
          </div>
        </form>

        <button
          className="bg-[#4caf4fd0] px-4 font-medium py-1.5 rounded-md transition-colors duration-300 hover:bg-[#4caf50] md:fixed md:top-6 md:right-8"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("blogData");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-36">
        <div className="flex flex-col gap-4">
          <div>
            {profileSuccessMessage && (
              <p className="text-green-500 mt-2">{profileSuccessMessage}</p>
            )}
            {profileErrorMessage && (
              <p className="text-red-500 mt-2">{profileErrorMessage}</p>
            )}
          </div>

          <p className="text-center font-semibold text-xl">User Profile</p>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              data-testid="username"
              className="text-black w-full py-3 px-4 rounded-md"
              style={{ fontSize: '16px' }}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              data-testid="email"
              value={email}
              className="text-black w-full py-3 px-4 rounded-md"
              style={{ fontSize: '16px' }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#4caf4fd0] py-3 px-4 font-medium rounded-md transition-colors duration-300 hover:bg-[#4caf50]"
          >
            Update Profile
          </button>
        </div>

        <ChangePassword />
      </div>
    </div>
  );
};

export default UpdateProfile;
