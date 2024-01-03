import React, { useState } from "react";

export default function Input({
  type,
  placeholder,
  autoFocus,
  required,
  minLength,
  value,
  onChange,
}) {
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue.trim() === "") {
      setError("Field cannot be empty");
    } else {
      setError("");
    }

    onChange(e);
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      className="appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
      autoComplete="true"
      autoFocus={autoFocus}
      required={required}
      minLength={minLength}
      value={value}
      onChange={handleInputChange}
    />
  );
}