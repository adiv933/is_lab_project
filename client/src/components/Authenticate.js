// import React, { useState } from 'react';
// import DATA from '../data';
// import { Dashboard } from './Dashboard';
// import { LoginPage } from './LoginPage';
// import { ClientDashboard } from './ClientDashboard';

// export const Authenticate = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [notif, setNotif] = useState({ message: '', style: '' });
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [client, setClient] = useState(null);
//   const localUsers = localStorage.getItem('users');

//   if (!localUsers) {
//     localStorage.setItem('users', JSON.stringify(DATA));
//   }

//   const clients = JSON.parse(localStorage.getItem('users'));

//   const isLoginSuccess = (number, pin) => {
//     let isFound = false;
//     clients.forEach(user => {
//       if (user.number === number && user.pin === pin) {
//         if (user.isAdmin) {
//           setIsAdmin(true);
//           setClient(user);
//           isFound = true;
//         }
//         else {
//           setIsAdmin(false);
//           setClient(user)
//           isFound = true;
//         }
//         setNotif('');
//       }
//     });

//     if (!isFound) setNotif({ message: 'Wrong account number and pin.', style: 'danger' });
//     return isFound;
//   }

//   const login = (number, pin) => {
//     if (isLoginSuccess(number, pin)) {
//       setIsLoggedIn(true);
//     }
//   }

//   const logout = () => {
//     setIsLoggedIn(false);
//     setIsAdmin(false);
//     localStorage.removeItem('client')
//     setNotif({ message: 'You have logged out.', style: 'success' });
//   }

//   if (isLoggedIn) {
//     localStorage.setItem('currentUser', JSON.stringify(client));
//     if (isAdmin) {
//       return <Dashboard users={clients} logoutHandler={logout} />
//     } else {

//       return <ClientDashboard client={client} users={clients} setClient={setClient} logout={logout} />
//     }
//   } else {
//     return <LoginPage loginHandler={login} notif={notif} isLoggedIn={isLoggedIn} />
//   }
// }

import React, { useState, useEffect } from 'react';
import { Dashboard } from './Dashboard';
import { LoginPage } from './LoginPage';
import { ClientDashboard } from './ClientDashboard';

export const Authenticate = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notif, setNotif] = useState({ message: '', style: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [client, setClient] = useState(null);
  const [users, setUsers] = useState([]);

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

          await setUsers(data.users); // Set users state with fetched data
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
        setIsAdmin(data.isAdmin);
        setClient(data.user);
        setIsLoggedIn(true);
        setNotif({ message: data.message, style: 'success' });
        console.log('setting current user:', data.user)
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      } else {
        const errorData = await response.json();
        setNotif({ message: errorData.message || 'Login failed. Please try again.', style: 'danger' });
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
      <ClientDashboard client={client} setClient={setClient} logout={logout} />
    );
  } else {
    return <LoginPage loginHandler={login} notif={notif} />;
  }
};
