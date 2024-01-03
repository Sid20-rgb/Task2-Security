import React from "react";
import { Line } from "react-chartjs-2";
import "./GraphDialog.css";

const GraphDialog = ({ chartData, onClose }) => {
  const chartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <div className="graph-dialog">
      {/* Dialog content */}
      <div className="dialog-content">
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          Close
        </button>

        {/* Display styled line graph */}
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default GraphDialog;
