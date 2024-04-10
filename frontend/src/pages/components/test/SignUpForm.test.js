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
    render(
      <BrowserRouter>
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
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({ message: "Success", token: "sampleToken", user: {} }),
    ok: true,
  })
);

describe("SignUpForm component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render sign up and sign in forms", () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
    expect(getByTestId("sign-up")).toBeInTheDocument();
    expect(getByTestId("sign-in")).toBeInTheDocument();
  });

  it("should call sign up API with correct data", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
    const usernameInput = getByTestId("username-input-signup");
    const emailInput = getByTestId("email-input-signup");
    const passwordInput = getByTestId("password-input-signup");
    const signUpBtn = getByTestId("signup-btn");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    fireEvent.click(signUpBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/signup"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "testuser",
            email: "test@example.com",
            password: "testpassword",
          }),
        }
      );
    });
  });

  it("should call sign in API with correct data", async () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <SignUpForm />
      </BrowserRouter>
    );
    const usernameInput = getByTestId("username-input-signin");
    const passwordInput = getByTestId("password-input-signin");
    const signInBtn = getByTestId("signin-btn");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    fireEvent.click(signInBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/signin"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "testuser",
            password: "testpassword",
          }),
        }
      );
    });
  });
});
