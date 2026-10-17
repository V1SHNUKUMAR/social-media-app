import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext();

export const DarkModeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) || true
  );

  const toggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);

    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};