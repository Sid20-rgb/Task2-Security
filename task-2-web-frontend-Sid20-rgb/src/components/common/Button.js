import React from "react";

export default function Button({ text, onClick }) {
  return (
    <button
      type="submit"
      className="w-full bg-[#E3536D] hover:bg-[#CA315A] text-white font-bold py-2 px-8 rounded"
      onClick={onClick} // Update the width value to your desired size
    >
      {text}
    </button>
  );
}
