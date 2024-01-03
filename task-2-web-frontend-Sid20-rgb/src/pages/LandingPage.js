import React from 'react';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          className="object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
          alt="Background"
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl font-bold text-white">Welcome to Our Website</h1>
        <p className="text-xl text-white">Discover the amazing features we offer.</p>
        <button className="px-6 py-3 mt-8 text-lg font-semibold text-white bg-blue-500 rounded hover:bg-blue-600">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
