import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import NavigationBar from "./navigation";

describe("Navigation", () => {
  test("should render correctly", () => {
    render(
      <Router>
        <NavigationBar />
      </Router>
    );
  });

  test("should display at least one 'Home' text", () => {
    render(
      <Router>
        <NavigationBar />
      </Router>
    );

    const homeTextElements = screen.getAllByText("Home");
    expect(homeTextElements.length).toBeGreaterThan(0);
  });

  test("should display at least one 'Create Blog' text", () => {
    render(
      <Router>
        <NavigationBar />
      </Router>
    );

    const signUpTextElements = screen.getAllByText("Create Blog");
    expect(signUpTextElements.length).toBeGreaterThan(0);
  });
});
