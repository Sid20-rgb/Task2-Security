import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Input from "./Input";

describe("Input", () => {
  test("should render correctly", () => {
    render(
      <Router>
        <Input />
      </Router>
    );
  });

  test("should render the correct placeholder", () => {
    render(
      <Router>
        <Input placeholder="Test Placeholder" />
      </Router>
    );

    const inputElement = screen.getByPlaceholderText("Test Placeholder");
    expect(inputElement).toBeInTheDocument();
  });
});
