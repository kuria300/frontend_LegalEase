// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("legalease_user") || "null")
  );
  const [token, setToken] = useState(
    () => localStorage.getItem("legalease_token") || null
  );

  const login = (userData, tokenVal) => {
    setUser(userData);
    setToken(tokenVal);
    localStorage.setItem("legalease_user", JSON.stringify(userData));
    localStorage.setItem("legalease_token", tokenVal);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("legalease_user");
    localStorage.removeItem("legalease_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);