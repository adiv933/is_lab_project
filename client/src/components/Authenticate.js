import React, { useEffect, useState } from "react";
import DATA from "../data";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { ClientDashboard } from "./ClientDashboard";
import axios from "axios";

export const Authenticate = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notif, setNotif] = useState({ message: "", style: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [client, setClient] = useState();
  const [clients, setClients] = useState([]);
  // const localUsers = localStorage.getItem("users");

  // if (!localUsers) {
  //   localStorage.setItem("users", JSON.stringify(DATA));
  // }

  //set clients here
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:5000/users");
        console.log("response", response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("response.data", data);
        setClients(data); // Assuming data is an array of clients
      } catch (error) {
        setNotif({ message: "Error fetching clients", style: "danger" });
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const isLoginSuccess = (number, pin) => {
    let isFound = false;
    clients.forEach((user) => {
      if (user.number === number && user.pin === pin) {
        if (user.isAdmin) {
          setIsAdmin(true);
          setClient(user);
          isFound = true;
        } else {
          setIsAdmin(false);
          setClient(user);
          isFound = true;
        }
        setNotif("");
      }
    });

    if (!isFound)
      setNotif({ message: "Wrong account number and pin.", style: "danger" });
    return isFound;
  };

  const login = (user) => {
    console.log("user inside Authenticate", user);
    if (user._id) {
      setIsLoggedIn(true);
      localStorage.setItem("currentUser", JSON.stringify(client));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("client");
    setNotif({ message: "You have logged out.", style: "success" });
  };

  if (isLoggedIn) {
    localStorage.setItem("currentUser", JSON.stringify(client));
    if (isAdmin) {
      return <Dashboard users={clients} logoutHandler={logout} />;
    } else {
      return (
        <ClientDashboard
          client={client}
          users={clients}
          setClient={setClient}
          logout={logout}
        />
      );
    }
  } else {
    return (
      <LoginPage loginHandler={login} notif={notif} isLoggedIn={isLoggedIn} />
    );
  }
};
