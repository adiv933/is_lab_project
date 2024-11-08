import React, { useState } from 'react';
import { Notif } from './Notif';

export const OtpPage = (props) => {
    const [otp, setOtp] = useState('');

    const onSubmitHandler = (event) => {
        event.preventDefault();
        props.verifyOtpHandler(otp); // Call verifyOtpHandler with OTP
    };

    const onChangeOtp = (event) => {
        setOtp(event.target.value);
    };

    return (
        <div id="otp-page">
            <Notif message={props.notif.message} style={props.notif.style} />
            <form onSubmit={onSubmitHandler}>
                <label htmlFor="otp">Enter OTP</label>
                <input
                    id="otp"
                    name="otp"
                    autoComplete="off"
                    onChange={onChangeOtp}
                    value={otp}
                    type="text"
                    required
                />
                <button type="submit" className="btn">Verify OTP</button>
            </form>
        </div>
    );
};
