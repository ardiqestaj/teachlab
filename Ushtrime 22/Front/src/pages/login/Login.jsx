import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../auth/api";
import styles from "./AuthPage.module.css";

const AuthPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", signInData);
      const token = res.data.token;
      localStorage.setItem("token", token);
      if (onLogin) onLogin(); // let App know
      navigate("/tours");
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { password, confirmPassword, ...rest } = signUpData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post("/users/createUsers", { ...rest, password });
      setIsSignUp(false);
      setError(null);
    } catch (err) {
      console.error("Register Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.root}>
      <div
        className={`${styles.container} ${
          isSignUp ? styles["right-panel-active"] : ""
        }`}
        id="container"
      >
        <div
          className={`${styles["form-container"]} ${styles["sign-up-container"]}`}
        >
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            <input
              type="text"
              placeholder="First Name"
              required
              value={signUpData.firstName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, firstName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              required
              value={signUpData.lastName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, lastName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              value={signUpData.phoneNumber}
              onChange={(e) =>
                setSignUpData({ ...signUpData, phoneNumber: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={signUpData.confirmPassword}
              onChange={(e) =>
                setSignUpData({
                  ...signUpData,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div
          className={`${styles["form-container"]} ${styles["sign-in-container"]}`}
        >
          <form onSubmit={handleSignIn}>
            <h1>Sign in</h1>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Email"
              required
              value={signInData.email}
              onChange={(e) =>
                setSignInData({ ...signInData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={signInData.password}
              onChange={(e) =>
                setSignInData({ ...signInData, password: e.target.value })
              }
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className={styles["overlay-container"]}>
          <div className={styles.overlay}>
            <div
              className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}
            >
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button className="ghost" onClick={() => setIsSignUp(false)}>
                Sign In
              </button>
            </div>
            <div
              className={`${styles["overlay-panel"]} ${styles["overlay-right"]}`}
            >
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </div>
  );
};

export default AuthPage;
