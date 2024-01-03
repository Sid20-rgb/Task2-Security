import React from "react";

export default function Button({
  text,
  onClick,
  bgColor = "E3536D",
  hoverBgColor = "CA315A",
  textColor = "#ffffff",
}) {
  return (
    <button
      type="submit"
      className={`w-full bg-[${bgColor}] hover:bg-[${hoverBgColor}] text-[${textColor}] font-bold py-2 px-8 rounded`}
      onClick={onClick} // Update the width value to your desired size
    >
      {text}
    </button>
  );
}
