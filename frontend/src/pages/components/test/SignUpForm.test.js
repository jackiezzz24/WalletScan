import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SignUpForm from "../SignUpForm";

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

describe("SignIn Component", () => {
  beforeEach(() => {
    // Use beforeEach to wrap the component for each test
    render(
      <BrowserRouter>
        {" "}
        <SignUpForm />
      </BrowserRouter>
    );
  });

  test("allows the user to type into the username input field", async () => {
    const usernameInput = screen.getByTestId("username-input-signin");

    await act(async () => {
      userEvent.type(usernameInput, "john.doe");
    });

    expect(usernameInput).toHaveValue("john.doe");
  });

  test("allows the user to type into the password input field", async () => {
    const passwordInput = screen.getByTestId("password-input-signin");

    await act(async () => {
      userEvent.type(passwordInput, "123456");
    });

    expect(passwordInput).toHaveValue("123456");
  });

  test("clicking on Sign In button triggers sign-in function", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: "Successfully Signed In" }),
      })
    );

    const signInButton = screen.getByTestId("signin-btn");
    userEvent.click(signInButton);

    expect(fetch).toHaveBeenCalled();
  });
});

describe("SignUp Form Title in SignUpForm Component", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
  });

  test("title displays the correct word using test id", () => {
    const signUpTitle = screen.getByTestId("sign-up");
    expect(signUpTitle).toBeInTheDocument();
    expect(signUpTitle).toHaveTextContent("Sign Up");
  });
});

describe("SignUp Component", () => {
  beforeEach(() => {
    // Use beforeEach to wrap the component for each test
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
  });

  test("allows the user to type into the username input field", async () => {
    const usernameInput = screen.getByTestId("username-input-signup");
    await act(async () => {
      userEvent.type(usernameInput, "john.doe");
    });
    expect(usernameInput).toHaveValue("john.doe");
  });

  test("allows the user to type into the email input field", async () => {
    const emailInput = screen.getByTestId("email-input-signup");
    await act(async () => {
      userEvent.type(emailInput, "test@example.com");
    });
    expect(emailInput).toHaveValue("test@example.com");
  });

  test("allows the user to type into the password input field", async () => {
    const passwordInput = screen.getByTestId("password-input-signup");
    await act(async () => {
      userEvent.type(passwordInput, "testpassword");
    });
    expect(passwordInput).toHaveValue("testpassword");
  });

  //   test("clicking on Sign Up button triggers sign-up function", async () => {
  //     // Mock fetch function
  //     global.fetch = jest.fn(() =>
  //       Promise.resolve({
  //         ok: true,
  //         json: () => Promise.resolve({ message: 'User Sign-Up Successfully. Please Sign-In.' }),
  //       })
  //     );

  //     // Select and click the Sign Up button
  //     const signUpButton = screen.getByTestId("signup-btn");
  //     console.log("Sign Up Button:", signUpButton); // Log button for debugging
  //     userEvent.click(signUpButton);

  //     // Wait for a short time to allow asynchronous operations to complete
  //     await new Promise((resolve) => setTimeout(resolve, 100));

  //     // Assert that the fetch function is called
  //     console.log("Number of calls to fetch:", fetch.mock.calls.length);
  //     expect(fetch).toHaveBeenCalled();
  // });
});

describe("SignUp Component", () => {
  afterEach(() => {
    jest.resetAllMocks(); // Clean up mocks after each test
  });

  it("clicking on Sign Up button triggers sign-up function", async () => {
    render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );

    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            message: "User Sign-Up Successfully. Please Sign-In.",
          }),
      })
    );

    // Select and click the Sign Up button
    const signUpButton = screen.getByTestId("signup-btn");
    fireEvent.click(signUpButton);

    // Debugging: Log fetch mock
    console.log("Fetch mock:", fetch);

    // Wait for the fetch function to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1); // Ensure fetch is called exactly once
    });
  });
});