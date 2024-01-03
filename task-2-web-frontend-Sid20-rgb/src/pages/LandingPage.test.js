import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { server } from "../mocks/server";
import LandingPage from "./LandingPage";

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Landing Page", () => {
  test("should render correctly", () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );
  });

  test("should display the landing page", () => {
    render(
      <Router>
        <LandingPage />
      </Router>
    );

    expect(
      screen.getByText("Discover the amazing features we offer.")
    ).toBeInTheDocument();
  });
});
