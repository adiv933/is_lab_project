// import React, { useState, useEffect } from 'react';
// import { Dashboard } from './Dashboard';
// import { LoginPage } from './LoginPage';
// import { ClientDashboard } from './ClientDashboard';

// export const Authenticate = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [notif, setNotif] = useState({ message: '', style: '' });
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [client, setClient] = useState(null);
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/all', {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });

//         if (response.status === 200) {
//           const data = await response.json();
//           localStorage.setItem('users', JSON.stringify(data.users));

//           await setUsers(data.users); // Set users state with fetched data
//         } else {
//           setNotif({ message: 'Error fetching users data', style: 'danger' });
//         }
//       } catch (error) {
//         setNotif({ message: 'Server error. Please try again later.', style: 'danger' });
//       }
//     };

//     if (isLoggedIn) {
//       fetchUsers(); // Only fetch if logged in
//     }
//   }, [isLoggedIn]);

//   const login = async (number, pin) => {
//     try {
//       const response = await fetch('http://localhost:5000/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ number, pin })
//       });

//       if (response.status === 200) {
//         const data = await response.json();
//         setIsAdmin(data.isAdmin);
//         setClient(data.user);
//         setIsLoggedIn(true);
//         setNotif({ message: data.message, style: 'success' });
//         console.log('setting current user:', data.user)
//         localStorage.setItem('currentUser', JSON.stringify(data.user));
//       } else {
//         const errorData = await response.json();
//         setNotif({ message: errorData.message || 'Login failed. Please try again.', style: 'danger' });
//       }
//     } catch (error) {
//       setNotif({ message: 'Server error. Please try again later.', style: 'danger' });
//     }
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setIsAdmin(false);
//     setClient(null);
//     localStorage.removeItem('currentUser');
//     setNotif({ message: 'You have logged out.', style: 'success' });
//   };

//   if (isLoggedIn) {
//     return isAdmin ? (
//       <Dashboard users={users} logoutHandler={logout} />
//     ) : (
//       <ClientDashboard client={client} setClient={setClient} logout={logout} />
//     );
//   } else {
//     return <LoginPage loginHandler={login} notif={notif} />;
//   }
// };

import React, { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { LoginPage } from './LoginPage';
import { ClientDashboard } from './ClientDashboard';
import { OtpPage } from './OtpPage'; // Create this new component for OTP input

export const Authenticate = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notif, setNotif] = useState({ message: '', style: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [client, setClient] = useState(null);
  const [users, setUsers] = useState([]);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP request
  const [accountNumber, setAccountNumber] = useState(null); // Track user for OTP

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 200) {
          const data = await response.json();
          localStorage.setItem('users', JSON.stringify(data.users));
          setUsers(data.users); // Set users state with fetched data
        } else {
          setNotif({ message: 'Error fetching users data', style: 'danger' });
        }
      } catch (error) {
        setNotif({ message: 'Server error. Please try again later.', style: 'danger' });
      }
    };

    if (isLoggedIn) {
      fetchUsers(); // Only fetch if logged in
    }
  }, [isLoggedIn]);

  const login = async (number, pin) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number, pin })
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('data', data)

        if (data.user && data.user.isAdmin) {
          setIsAdmin(data.isAdmin);
          setClient(data.user);
          setIsLoggedIn(true);
          setNotif({ message: 'OTP verified successfully!', style: 'success' });
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          return;
        }

        setIsOtpSent(true); // OTP step triggered
        setAccountNumber(number); // Store account number for OTP verification
        setNotif({ message: data.message, style: 'info' });
      } else {
        const errorData = await response.json();
        setNotif({ message: errorData.message || 'Login failed. Please try again.', style: 'danger' });
      }
    } catch (error) {
      setNotif({ message: 'Server error. Please try again later.', style: 'danger' });
    }
  };

  const verifyOtp = async (otp) => {
    try {
      const response = await fetch('http://localhost:5000/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ number: accountNumber, otp })
      });

      if (response.status === 200) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        setClient(data.user);
        setIsLoggedIn(true);
        setNotif({ message: 'OTP verified successfully!', style: 'success' });
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      } else {
        const errorData = await response.json();
        setNotif({ message: errorData.message || 'Invalid OTP. Please try again.', style: 'danger' });
      }
    } catch (error) {
      setNotif({ message: 'Server error. Please try again later.', style: 'danger' });
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setClient(null);
    localStorage.removeItem('currentUser');
    setNotif({ message: 'You have logged out.', style: 'success' });
  };

  if (isLoggedIn) {
    return isAdmin ? (
      <Dashboard users={users} logoutHandler={logout} />
    ) : (
      <ClientDashboard client={client} users={users} setClient={setClient} logout={logout} />
    );
  } else if (isOtpSent) {
    // Render OTP input page if OTP has been sent
    return <OtpPage verifyOtpHandler={verifyOtp} notif={notif} />;
  } else {
    return <LoginPage loginHandler={login} notif={notif} />;
  }
};
