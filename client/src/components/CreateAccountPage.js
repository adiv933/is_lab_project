import { useState } from "react";
import { Notif } from "./Notif";
import { formatNumber, trim } from './Utils';

export const CreateAccountPage = (props) => {
    const createRandomAccount = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    }

    const [notif, setNotif] = useState({ message: 'Create a new client account.', style: 'left' });
    const [initialBalance, setInitialBalance] = useState(0);
    const [initialAccountNumber, setInitialAccountNumber] = useState(createRandomAccount());

    const createNewAccount = async (user) => {
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });

            if (response.status === 201) {
                setNotif({ message: 'Successfully saved.', style: 'success' });
                return true;
            } else if (response.status === 400) {
                setNotif({ message: 'This email already exists. Try again.', style: 'danger' });
                return false;
            } else {
                setNotif({ message: 'Error creating account. Please try again.', style: 'danger' });
                return false;
            }
        } catch (error) {
            setNotif({ message: 'Server error. Please try again later.', style: 'danger' });
            return false;
        }
    };

    const handleCreateAccount = async (event) => {
        event.preventDefault();
        const user = event.target.elements;

        const account = {
            email: user.email.value,
            pin: user.password.value,  // Changed to "pin" to match server-side code
            fullname: user.fullname.value,
            type: user.accountType.value,
            number: user.accountNumber.value,
            balance: trim(user.initialBalance.value),
            transactions: []
        };

        const isSaved = await createNewAccount(account);
        if (isSaved) {
            user.email.value = '';
            user.password.value = '';
            user.fullname.value = '';
            user.accountNumber.value = setInitialAccountNumber(createRandomAccount());
            user.initialBalance.value = setInitialBalance(0);
        }
    };

    const onInitialBalance = event => {
        const amount = trim(event.target.value) || 0;
        setInitialBalance(amount);
    };

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleCreateAccount}>
                <h1>Create Account</h1>
                <Notif message={notif.message} style={notif.style} />
                <label htmlFor="fullname">Full name</label>
                <input id="fullname" type="text" autoComplete="off" name="fullname" />
                <hr />
                <label htmlFor="account-number">Account # (Randomly Generated)</label>
                <input id="account-number" name="accountNumber" className="right" value={initialAccountNumber} type="number" disabled />

                <label htmlFor="balance">Initial balance</label>
                <input id="balance" type="text" value={formatNumber(initialBalance)} onChange={onInitialBalance} name="initialBalance" className="right" />

                <label htmlFor="account-type">Account Type</label>
                <select name="accountType">
                    <option value="Checking Account">Checking Account</option>
                    <option value="Savings Account">Savings Account</option>
                </select>
                <hr />
                <label htmlFor="email">Email Address</label>
                <input id="email" type="email" name="email" />
                <label htmlFor="password">Password</label>
                <input id="password" type="password" name="password" />
                <input value="Create Account" className="btn" type="submit" />
            </form>
        </section>
    );
};
