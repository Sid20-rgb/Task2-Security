import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import UpdateProfile from "./UpdateProfile";

const customRender = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <UserContext.Provider value={providerProps}>{ui}</UserContext.Provider>,
    renderOptions
  );
};

describe("Update Profile Page", () => {
  let providerProps;

  beforeEach(() => {
    providerProps = {
      user: null,
      setUser: jest.fn(),
      isLoading: false,
      setIsLoading: jest.fn(),
    };
  });

  test("should render correctly", () => {
    customRender(
      <Router>
        <UpdateProfile />
      </Router>,
      { providerProps }
    );
  });

  test("should display at least one 'Update Profile' text", () => {
    customRender(
      <Router>
        <UpdateProfile />
      </Router>,
      { providerProps }
    );

    const updateProfileTextElements = screen.getAllByText("Update Profile");
    expect(updateProfileTextElements.length).toBeGreaterThan(0);
  });

  test("should display input fields for username and password", () => {
    customRender(
      <Router>
        <UpdateProfile />
      </Router>,
      { providerProps }
    );

    // <input
    //       type="text"
    //       id="username"
    //       value={username}
    //       className="text-black"
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    const usernameInput = screen.getByTestId("username");
    const emailInput = screen.getByTestId("email");

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  test("should update a user when the form is submitted", async () => {
    customRender(
      <Router>
        <UpdateProfile />
      </Router>,
      { providerProps }
    );

    // Simulate user input
    fireEvent.change(screen.getByTestId("username"), {
      target: { value: "testuser" },
    });

    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "testemail" },
    });

    const updateProfileButton = screen.getByRole("button", {
      name: /UPDATE PROFILE/i,
    });

    fireEvent.click(updateProfileButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(window.location.href).toBe("http://localhost/");
    });
  });
});
