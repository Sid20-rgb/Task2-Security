import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Explore = ({ showUserProfile, handleTabClick }) => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/users/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => setUsers(response.data.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div
      className={`${
        showUserProfile ? "hidden lg:grid" : "block"
      } mt-[180px] z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 xl:grid-cols-4`}
    >
      {currentUser ? (
        users.map((user) => (
          <div
            className="relative rounded-lg shadow-lg mb-4 max-h-[12rem]"
            onClick={() => {
              handleTabClick("individualUserPosts");
              localStorage.setItem("userIdForExplore", user.id);
            }}
          >
            <img
              src={
                user.image == null
                  ? "https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png"
                  : `http://localhost:3001/uploads/${user.image}`
              }
              alt="Blog Cover"
              className="w-full h-full rounded-lg object-cover hover:opacity-60 hover:brightness hover:bg-black transition duration-300 ease-in-out"
            />

            <div className="absolute z-20 bottom-0 left-0 px-4">
              <p className="text-white font-semibold">{user.username}</p>
              <p className="text-white text-sm font-medium">{user.email}</p>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-40 rounded-lg"></div>
          </div>
        ))
      ) : (
        <div>
          <h1>Please login</h1>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Explore;
