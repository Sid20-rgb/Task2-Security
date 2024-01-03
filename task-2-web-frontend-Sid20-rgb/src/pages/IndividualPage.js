import React from "react";
import "./indstyle.css";

const IndividualPage = () => {
  return (
    <div className="container min-w-[100vw] py-8 flex flex-col gap-4">
      <div className="cover-image">
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
          alt="Blog Cover"
          className="w-full max-h-[230px] object-cover rounded-lg opacity-35"
        />
        <div className="image-overlay">
          <div className="profile-picture">
            <img
              src="https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg"
              alt="Profile"
              className="w-15 h-15 rounded-full"
            />
          </div>
          <div className="user-details">
            <h2>Username</h2>
            <p>Date</p>
            <h1>Title</h1>
          </div>
        </div>
      </div>
      <div className="content">
        <div className="scrollable-content">
          <div className="random-texts">
            <p>Random text</p>
            <img src="image1.jpg" alt="Image 1" />
            <p>Random text</p>
            <img src="image2.jpg" alt="Image 2" />
            <p>Random text</p>
            <img src="image3.jpg" alt="Image 3" />
            <p>Random text</p>
            <img src="image3.jpg" alt="Image 3" />
            <p>Random text</p>
            <img src="image3.jpg" alt="Image 3" />
            <p>Random text</p>
            <img src="image3.jpg" alt="Image 3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualPage;
