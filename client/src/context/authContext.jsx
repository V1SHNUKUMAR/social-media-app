import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

  const register = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/register", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data)
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login, register, logout, }}>
      {children}
    </AuthContext.Provider>
  );
}; 