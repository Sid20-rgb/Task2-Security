import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Button from "./Button";

describe("Primary Button", () => {
  test("should display a button", () => {
    render(
      <Router>
        <Button />
      </Router>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("should call onClick when clicked", () => {
    const onClick = jest.fn();

    render(
      <Router>
        <Button onClick={onClick} />
      </Router>
    );

    const button = screen.getByRole("button");

    button.click();

    expect(onClick).toHaveBeenCalled();
  });
});
