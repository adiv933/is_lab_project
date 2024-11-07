import React, { useState } from "react";
import axios from "axios"; // Import axios
import { Logo } from "./Logo";
import { Notif } from "./Notif";

export const LoginPage = (props) => {
  const [number, setNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState(""); // State for error messages

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:5000/login", {
        number,
        pin,
      });

      // console.log(response.data.user);

      // Handle successful response
      props.loginHandler(response.data.user); // Assuming loginHandler updates the user state
    } catch (err) {
      // Handle error
      const errorMessage = err.response
        ? err.response.data.message || "An error occurred"
        : "Network error. Please try again.";
      setError(errorMessage); // Set error message to state
    }
  };

  const onChangeNumber = (event) => {
    setNumber(event.target.value);
  };

  const onChangePin = (event) => {
    setPin(event.target.value);
  };

  return (
    <div id="login-page">
      <div id="login">
        <Logo />
        <Notif message={props.notif.message} style={props.notif.style} />
        {error && <div style={{ color: "red" }}>{error}</div>}{" "}
        {/* Display error message */}
        <form onSubmit={onSubmitHandler}>
          <label htmlFor="number">Account Number</label>
          <input
            id="number"
            autoComplete="off"
            onChange={onChangeNumber}
            value={number}
            type="number"
          />
          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            autoComplete="off"
            onChange={onChangePin}
            value={pin}
            type="password"
          />
          <button type="submit" className="btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
