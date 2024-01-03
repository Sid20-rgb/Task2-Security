import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { server } from "../mocks/server";
import SignupPage from "./SignupPage";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe("Signup Page", () => {
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
        <SignupPage />
      </Router>,
      { providerProps }
    );
  });

  test("should sign up a user when the form is submitted with valid data", async () => {
    customRender(
      <Router>
        <SignupPage />
      </Router>,
      { providerProps }
    );

    // Simulate user input
    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "Test Username" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "testuser1@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "testpassword" },
    });

    fireEvent.change(screen.getByPlaceholderText("Re-enter your password"), {
      target: { value: "testpassword" },
    });

    const createAccountButton = screen.getByRole("button", {
      name: /REGISTER/i,
    });

    fireEvent.click(createAccountButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost/");
    });
  });
});
