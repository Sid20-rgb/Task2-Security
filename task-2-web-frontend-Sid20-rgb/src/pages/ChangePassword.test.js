import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ChangePassword from "./ChangePassword";

describe("ChangePassword", () => {
    test("should render correctly", () => {
        render(
        <Router>
            <ChangePassword />
        </Router>
        );
    });
    
    test("should display at least one 'Change Password' text", () => {
        render(
        <Router>
            <ChangePassword />
        </Router>
        );
    
        const changePasswordTextElements = screen.getAllByText("Change Password");
        expect(changePasswordTextElements.length).toBeGreaterThan(0);
    });
    
    test("should display input fields for old password, new password and confirm password", () => {
        render(
        <Router>
            <ChangePassword />
        </Router>
        );
    
        const oldPasswordInput = screen.getByPlaceholderText(/Enter your current password/i);
        const newPasswordInput = screen.getByPlaceholderText(/Enter your new password/i);
        const confirmPasswordInput = screen.getByPlaceholderText(/Confirm your new password/i);
    
        expect(oldPasswordInput).toBeInTheDocument();
        expect(newPasswordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
    });
    });