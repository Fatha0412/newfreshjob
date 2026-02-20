import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("JOBS@RSR_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      api.defaults.headers.common["Authorization"] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const userData = res.data;
    setUser(userData);
    localStorage.setItem("JOBS@RSR_user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    const userData = res.data;
    setUser(userData);
    localStorage.setItem("JOBS@RSR_user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("JOBS@RSR_user");
    delete api.defaults.headers.common["Authorization"];
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("JOBS@RSR_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
