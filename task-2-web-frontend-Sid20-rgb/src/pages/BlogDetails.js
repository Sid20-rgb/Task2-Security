import axios from "axios";
import Chart from "chart.js/auto";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  FaArrowLeft,
  FaArrowUp,
  FaCommentDots,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import GraphDialog from "./GraphDialog";

const chartOptions = {
  scales: {
    x: {
      type: "category",
      beginAtZero: true,
      title: {
        display: true,
        text: "Data Category", // X-axis label
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Value", // Y-axis label
      },
    },
  },
  plugins: {
    title: {
      display: true,
      text: "Geographical and Tourist Data", // Chart title
    },
    legend: {
      display: true,
      position: "top", // You can change the position to 'bottom', 'left', 'right', etc.
    },
    tooltip: {
      mode: "index", // Display multiple data points' tooltips when hovering over a point
    },
  },
  responsive: true, // Make the chart responsive to container size
  maintainAspectRatio: false, // Allow aspect ratio to be adjusted
  interaction: {
    mode: "index", // Enable index mode for tooltip interactions
    intersect: false, // Allow tooltips to display even if cursor doesn't exactly hit a data point
  },
};

const BlogDetails = () => {
  const blog = JSON.parse(localStorage.getItem("blogData"));
  const navigate = useNavigate();
  const [blogAuthor, setBlogAuthor] = useState({});
  const sectionRefs = useRef([]);
  const [showScrollUpButton, setShowScrollUpButton] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [searchPlace, setSearchPlace] = useState("");
  const [chartData, setChartData] = useState(null);
  const chartContainerRef = useRef(null);
  const [isGraphDialogOpen, setIsGraphDialogOpen] = useState(false);

  const { user } = useContext(UserContext);

  // Function to handle the graph icon click
  const handleGraphIconClick = () => {
    setShowGraph(!showGraph); // Toggle graph visibility
  };

  const handleSearchPlace = async () => {
    try {
      console.log("Starting API call");
      const response = await axios.get(
        `https://api.opentripmap.com/0.1/en/places/geoname?name=${searchPlace}&apikey=5ae2e3f221c38a28845f05b667b686e3cd6ecd551a13e628125bf5bd`
      );

      console.log("API Response:", response.data);

      const placeData = response.data;

      console.log("Place Data:", placeData);

      // Create the chart data object
      const newChartData = {
        labels: ["Population", "Elevation", "Rank"],
        datasets: [
          {
            label: "Geographical and Tourist Data",
            data: [placeData.population, placeData.elevation, placeData.rank],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };

      // Set chart data in state
      setChartData(newChartData);

      // Show the graph
      // setShowGraph(true);
    } catch (error) {
      console.error("API Error:", error);
      // Handle error
    }
    setIsGraphDialogOpen(true);
  };

  useEffect(() => {
    // Initialize chart when chartData changes
    if (showGraph && chartData) {
      if (
        chartContainerRef.current &&
        chartContainerRef.current.chartInstance
      ) {
        console.log("Destroying chart instance");
        chartContainerRef.current.chartInstance.destroy(); // Destroy the existing chart instance
        console.log("Chart instance destroyed");
      }

      const newChartInstance = new Chart(chartContainerRef.current, {
        type: "bar",
        data: chartData,
        options: {
          ...chartOptions,
          scales: {
            x: {
              type: "category",
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      chartContainerRef.current.chartInstance = newChartInstance; // Store the new chart instance
    }
  }, [showGraph, chartData]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/users/${blog.user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBlogAuthor(response.data);
      })
      .catch((error) => console.log(error));
  }, [blog.user.id]);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(
      0,
      blog.content.split("\n\n").length
    );
  }, [blog.content]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollUpButton(true);
      } else {
        setShowScrollUpButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScrollToSection = (category) => {
    const categoryIndex = blog.content
      .split("\n\n")
      .findIndex((paragraph) => paragraph.includes(category));

    if (categoryIndex !== -1) {
      const sectionElement = sectionRefs.current[categoryIndex];
      if (sectionElement) {
        const yOffset = -80;
        const y =
          sectionElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        alert(`Section is not available in the content.`);
      }
    } else {
      alert(`"${category}" section not found in the content.`);
    }
  };

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openGoogleMaps = () => {
    window.open("https://www.google.com/maps", "_blank");
  };

  return (
    <div>
      <div className="relative rounded-b-3xl">
        <div className="min-w-screen h-[60vh]">
          <img
            src={`http://localhost:3001/uploads/${blog.blogCover}`}
            className="w-full h-full object-cover rounded-b-3xl"
            alt="Blog Cover"
          />
        </div>

        <div className="absolute bg-[#0000006c] top-0 left-0 w-full h-full rounded-b-3xl"></div>

        <FaArrowLeft
          className="absolute z-20 top-4 left-4 text-2xl text-white cursor-pointer"
          onClick={() => {
            navigate(`/homepage`);
          }}
        />

        <div className="absolute top-4 right-4 z-20 flex gap-4">
          <FaCommentDots
            className="text-4xl text-white cursor-pointer hover:text-blue-500 transition duration-300"
            onClick={() => {
              if (user) {
                navigate(`/commentpage`);
              } else {
                navigate("/please-signin");
              }
            }}
          />
          <FaMapMarkedAlt
            className="text-4xl text-white cursor-pointer hover:text-green-500 transition duration-300"
            onClick={openGoogleMaps}
          />
          {/* <FaChartBar
            className="text-4xl text-white cursor-pointer hover:text-yellow-500 transition duration-300"
            onClick={handleGraphIconClick}
            style={{ marginLeft: "6px" }} // Add inline CSS to create space
          /> */}
        </div>

        <div className="absolute bottom-0 left-4 text-white flex flex-col">
          <div>
            <h2 className="text-lg font-semibold" style={{ fontSize: "30px" }}>
              {blog.title}
            </h2>
            <p className="text-sm" style={{ marginTop: "15px" }}>
              {blog.date.substring(0, 10)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <img
              src={
                blogAuthor?.image == null
                  ? "https://img.freepik.com/free-icon/user_318-159711.jpg"
                  : `http://localhost:3001/uploads/${blogAuthor?.image}`
              }
              alt="Blog Author"
              className="w-[3rem] rounded-full"
            />
            <p>@{blogAuthor?.username}</p>
          </div>
        </div>
      </div>

      <div className="text-white font-medium px-10 py-4 flex flex-col gap-3">
        <div className="flex flex-row items-center justify-center gap-4">
          {/* Stylish buttons */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
            onClick={() => handleScrollToSection("TIPS and RECOMMENDATIONS")}
          >
            TIPS and RECOMMENDATIONS
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300"
            onClick={() => handleScrollToSection("DESTINATION REVIEWS")}
          >
            DESTINATION REVIEWS
          </button>
          <button
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-full transition duration-300"
            onClick={() => handleScrollToSection("LINKS and RESOURCES")}
          >
            LINKS and RESOURCES
          </button>
        </div>

        {blog.content.split("\n\n").map((paragraph, index) => (
          <p
            key={`section-${index}`}
            ref={(ref) => (sectionRefs.current[index] = ref)}
            id={`section-${index}`}
          >
            {paragraph.includes("TIPS and RECOMMENDATIONS") ? (
              <span className="font-bold text-blue-500">{paragraph}</span>
            ) : paragraph.includes("DESTINATION REVIEWS") ? (
              <span className="font-bold text-green-500">{paragraph}</span>
            ) : paragraph.includes("LINKS and RESOURCES") ? (
              <span className="font-bold text-purple-500">{paragraph}</span>
            ) : (
              paragraph
            )}
          </p>
        ))}

        {showScrollUpButton && (
          <div
            className="fixed bottom-4 right-4 cursor-pointer bg-red-600 rounded-full p-2 hover:bg-gray-700 transition duration-300"
            onClick={handleScrollUp}
          >
            <FaArrowUp className="text-white text-2xl" />
          </div>
        )}
      </div>

      {/* Graph section */}

      <div className="text-white font-medium px-10 py-4 flex flex-col gap-3">
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Search for a place..."
            value={searchPlace}
            onChange={(e) => setSearchPlace(e.target.value)}
            className="bg-gray-100 p-2 rounded-md"
            style={{ color: "black" }}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300"
            onClick={handleSearchPlace}
          >
            Search
          </button>
        </div>

        {/* Display bar graph */}

        {showGraph && chartData && (
          <div style={{ width: "100%", height: "400px" }}>
            <Line
              data={chartData}
              options={chartOptions}
              ref={chartContainerRef}
            />
          </div>
        )}

        {isGraphDialogOpen && (
          <GraphDialog
            chartData={chartData}
            onClose={() => setIsGraphDialogOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
