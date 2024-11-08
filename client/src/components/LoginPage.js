import React, { useState } from 'react';
import { Logo } from './Logo';
import { Notif } from './Notif';

export const LoginPage = (props) => {
  const [number, setNumber] = useState('');
  const [pin, setPin] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    props.loginHandler(number, pin); // Call loginHandler from props with user input
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
        <form onSubmit={onSubmitHandler}>
          <label htmlFor="number">Account Number</label>
          <input
            id="number"
            name="number"
            autoComplete="off"
            onChange={onChangeNumber}
            value={number}
            type="number"
            required
          />

          <label htmlFor="pin">PIN</label>
          <input
            id="pin"
            name="pin"
            autoComplete="off"
            onChange={onChangePin}
            value={pin}
            type="password"
            required
          />

          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
};
