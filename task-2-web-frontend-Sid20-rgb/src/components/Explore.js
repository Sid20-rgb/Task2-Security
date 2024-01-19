import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Explore = ({ showUserProfile, handleTabClick }) => {
  const [users, setUsers] = useState([]);
  const { user } = useContext(UserContext);

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
      {user ? (
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
        <div
          className="flex min-w-[calc(100vw_-_50px)] md:min-w-[calc(100vw_-_560px)]
        items-center justify-center h-screen bg-gray-800 text-white"
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Opps!!</h1>
            <p className="text-lg mb-8">
              It looks like you need to login to view this page.
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
    </div>
  );
};

export default Explore;
