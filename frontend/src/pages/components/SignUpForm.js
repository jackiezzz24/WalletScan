import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import "../components/SignUpForm.css";
import { useNavigate } from "react-router-dom";

const move = keyframes`
0%{
    opacity:0;
}
95%{
    opacity:1;
}
`;
const BackgroundBox = styled.div`
  background-color: #beeefb;
  height: 50vh;
  width: 50vw;

  display: flex;
  justify-content: center;
  align-items: center;

  margin: 15vh auto;

  position: relative;
  border-radius: 23px;
  border: 1px solid #053271;

  .text1 {
    z-index: ${(props) => (props.clicked ? "-700" : "700")};
    transform: ${(props) =>
      props.clicked ? "translateX(0)" : "translateX(100%)"};
    transition: transform 1s ease-in-out;
    animation: ${(props) => (props.clicked ? move : "none")} 1.5s;
  }

  .text2 {
    z-index: ${(props) => (props.clicked ? "700" : "-700")};
    animation: ${(props) => (props.clicked ? "none" : move)} 1.5s;

    transform: ${(props) =>
      props.clicked ? "translateX(-100%)" : "translateX(0%)"};
    transition: transform 1s ease-in-out;
  }

  .signin {
    position: absolute;
    top: 0%;
    text-align: center;
    z-index: ${(props) => (props.clicked ? "-600" : "500")};
    transform: ${(props) => (props.clicked ? "none" : "translateX(-50%)")};
    transition: all 1s;
  }
  .signup {
    position: absolute;
    top: 0%;
    text-align: center;
    z-index: ${(props) => (props.clicked ? "500" : "-500")};
    transform: ${(props) =>
      props.clicked ? "translateX(50%)" : "translateX(-50%)"};
    transition: all 1s;
  }
`;

const Box1 = styled.div`
  background-color: #f1fdcd;
  width: 50%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;

  transform: ${(props) =>
    props.clicked ? "translateX(90%)" : "translateX(10%)"};

  transition: transform 1s;

  &::after,
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #f1fdcd;

    z-index: -200;
  }

  &::before {
    top: 3vw;
    border-radius: 23px;
    border: 4px solid #053271;
  }

  &::after {
    bottom: 3vw;
    border-radius: 23px 23px 0 0;
    border-top: 4px solid #053271;
    border-right: 4px solid #053271;
    border-left: 4px solid #053271;
  }
`;

const Box2 = styled.div`
  background-color: #053271;
  width: 45.5%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;

  z-index: 600;
  transform: ${(props) =>
    props.clicked ? "translateX(-120.5%)" : "translateX(0%)"};
  transition: transform 1s;

  border-radius: ${(props) =>
    props.clicked ? "23px 0 0 23px" : "0 23px 23px 0"};
`;

const Form = styled.form`
  color: #1b1b1b;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 3.5vw;

  /* z-index: 100; */
`;

const Input = styled.input`
  background-color: #fff;
  border: none;
  border-bottom: 2px solid #053271;

  padding: 1vw 1.5vw;
  margin: 1vh 0;
  width: 100%;
  font-size: 1vw;

  &:focus {
    outline: none;
    border: none;
    border: 2px solid #053271;
  }
`;

const Button = styled.button`
  border-radius: 3px;
  padding: 1vw 3.5vw;
  margin-top: 1vw;
  border: 1px solid black;
  background-color: black;
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 2px;
  font-size: 1.2vw;

  box-shadow: 0 7px #999;

  &:hover {
    background-color: #1b1b1b;
  }
  &:active {
    background-color: black;

    box-shadow: 0 5px #666;
    transform: translateY(4px);
  }

  &:focus {
    outline: none;
  }
`;

const Title = styled.h1`
  font-size: 2vw;
  margin-bottom: 2vh;
`;

const Link = styled.a`
  text-decoration: none;
  color: #333;
  font-size: 1.2vw;
  margin: 3vh 0;
`;

const ButtonAnimate = styled.button`
  position: absolute;
  z-index: 900;
  height: 5vh;
  width: 5vw;
  top: 70%;
  border: none;
  cursor: pointer;

  right: ${(props) => (props.clicked ? "50%" : "41%")};

  transform: ${(props) => (props.clicked ? "rotate(360deg)" : "rotate(0)")};

  transition: all 1.5s;
  background-color: transparent;

  &::before {
    content: "💰";
    font-size: 4vw;
  }

  &:focus {
    outline: none;
  }
`;

const Text = styled.div`
  position: absolute;
  z-index: 1000;
  font-size: 1.2vw;
  display: flex;
  flex-direction: column;
  letter-spacing: 0.1vw;
  color: #fff;

  .attention {
    font-size: 1.5vw;
    position: relative;
    margin-top: 50%;
  }

  .attention-icon {
    position: relative;
    right: ${(props) => (props.clicked ? "0" : "none")};
    top: 80%;
    font-size: 2vw;
  }
`;

function SignUpForm() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const navigate = useNavigate();

  const onSignUpTapped = async () => {
    try {
      if (!username || !email || !password) {
        alert("Please fill in all the required fields");
        return;
      }

      const baseUrl = process.env.REACT_APP_API;
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (response.ok) {
        alert(result.message);
      } else {
        handleAuthError(result);
      }
    } catch (error) {
      alert("User doesn't exists", error.message);
    }
  };

  const handleAuthError = (errorResult) => {
    if (errorResult.statusCode === 400) {
      // Handle validation errors
      alert(`Validation Error: ${errorResult.error}`);
    } else if (errorResult.statusCode === 500) {
      // Handle server errors
      alert(`Server Error: ${errorResult.error}`);
    } else {
      // Handle other errors
      alert("Unexpected Error");
    }
  };

  const onSignInTapped = async () => {
    try {
      if (!emailLogin || !passwordLogin) {
        alert("Please fill in all the required fields");
        return;
      }
      const url = `${process.env.REACT_APP_API}/auth/signin`;
      console.log("URL:", url);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailLogin,
          password: passwordLogin,
        }),
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.statusCode === 200) {
        // Save the token to localStorage
        localStorage.setItem("authToken", result.token);
        alert(result.message);
        navigate(-1);
      } else if (result.statusCode === 400) {
        // Handle validation errors
        alert(`Validation Error: ${result.error}`);
      } else if (result.statusCode === 500) {
        // Handle server errors
        alert(`Server Error: ${result.error}`);
      } else {
        // Handle other errors
        alert("Unexpected Error");
      }
    } catch (error) {
      alert("Error during sign-in:", error.message);
    }
  };

  return (
    <>
      {" "}
      <BackgroundBox clicked={click}>
        <ButtonAnimate clicked={click} onClick={handleClick}></ButtonAnimate>

        <Form className="signin">
          <Title>Sign In</Title>
          <Input
            type="email"
            name="email"
            id="emailLoginId"
            placeholder="Email"
            value={emailLogin}
            onChange={(event) => {
              setEmailLogin(event.target.value);
            }}
          />
          <Input
            type="password"
            name="password"
            id="passwordLoginId"
            placeholder="Password"
            value={passwordLogin}
            onChange={(event) => {
              setPasswordLogin(event.target.value);
            }}
          />
          <Link href="#" onClick={handleClick}>Don't have an account?</Link>
          <Button onClick={onSignInTapped}>Sign In</Button>
        </Form>

        <Form className="signup">
          <Title>Sign Up</Title>
          <Input
            type="text"
            name="username"
            id="usernameId"
            placeholder="Username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />

          <Input
            type="email"
            name="email"
            id="emailId"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <Input
            type="password"
            name="password"
            id="passwordId"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <Link href="#" onClick={handleClick}>
            Already have an Account?
          </Link>
          <Button onClick={onSignUpTapped}>Sign Up</Button>
        </Form>

        <Text className="text1" clicked={click}>
          <h1>Welcome!</h1>
          Don't have an account?
          <br />
          <span className="attention">Click Here !</span>
          <span className="attention-icon">⤶</span>
        </Text>

        <Text className="text2" clicked={click}>
          <h1>Hi There!</h1>
          Already have an account?
          <br />
          <span className="attention">Click Here !</span>
          <span className="attention-icon">⤷</span>
        </Text>

        <Box1 clicked={click} />
        <Box2 clicked={click} />
      </BackgroundBox>
    </>
  );
}

export default SignUpForm;
