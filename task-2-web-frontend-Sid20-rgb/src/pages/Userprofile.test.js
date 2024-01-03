import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import UserProfile from "./Userprofile";

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe("Userprofile", () => {
  let providerProps;

  beforeEach(() => {
    providerProps = {
      setUser: jest.fn(),
      isLoading: false,
      setIsLoading: jest.fn(),
    };
  });

  test("should render correctly", () => {
    customRender(
      <Router>
        <UserProfile />
      </Router>,
      { providerProps }
    );
  });

  test("should display at least one 'Your Upload' text", () => {
    customRender(
      <Router>
        <UserProfile />
      </Router>,
      { providerProps }
    );

    const updateProfileTextElements = screen.getAllByText("Your Upload");
    expect(updateProfileTextElements.length).toBeGreaterThan(0);
  });
});
