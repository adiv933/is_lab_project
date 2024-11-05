import React, { useState } from 'react';
import { Logo } from './Logo';
import { Notif } from './Notif';

export const LoginPage = (props) => {
  const [number, setNumber] = useState('');
  const [pin, setPin] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    props.loginHandler(number, pin);
  }

  const onChangeNumber = (event) => {
    setNumber(event.target.value);
  }

  const onChangePin = (event) => {
    setPin(event.target.value);
  }

  return (
    <div id="login-page">
      <div id="login">
        <Logo />
        <Notif message={props.notif.message} style={props.notif.style} />
        <form onSubmit={onSubmitHandler}>
          <label htmlFor="number">Account Number</label>
          <input id="number" autoComplete="off" onChange={onChangeNumber} value={number} type="number" />
          <label htmlFor="pin">PIN</label>
          <input id="pin" autoComplete="off" onChange={onChangePin} value={pin} type="password" />
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  )
}
