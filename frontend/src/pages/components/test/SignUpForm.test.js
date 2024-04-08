import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event"; // Ensure this is imported
import SignUpForm from "../SignUpForm"; // Adjust the path based on your project structure

describe("SignIn Form Title in SignUpForm Component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
  });

  test("title displays the correct word using test id", () => {
    const signInTitle = screen.getByTestId("sign-in");
    expect(signInTitle).toBeInTheDocument();
    expect(signInTitle).toHaveTextContent("Sign In");
  });
});

describe("Input Component", () => {
  beforeEach(() => {
    // Use beforeEach to wrap the component for each test
    render(
      <BrowserRouter>
        {" "}
        {/* This fix ensures that useNavigate works */}
        <SignUpForm />
      </BrowserRouter>
    );
  });

  test("allows the user to type into the username input field", async () => {
    // Select the input field by its test ID
    const usernameInput = screen.getByTestId("username-input");

    // Simulate typing into the input field
    await act(async () => {
      // Simulate typing into the input field
      userEvent.type(usernameInput, "john.doe");
    });

    // Assert that the input's value has been updated
    expect(usernameInput).toHaveValue("john.doe");
  });
});
