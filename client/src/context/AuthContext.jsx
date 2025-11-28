import React, { useState, useEffect, createContext } from "react";
import API from "../api/apiCheck.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    refreshUser();
  }, []);
  async function refreshUser() {
    try {
      await API.get("/refresh-token").then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.accessToken);
        setUser(res.data.user);
      });
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  const loginUser = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.user);
    navigate("/");
  };

  const logoutUser = async () => {
    await API.post("/logout");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };
  return (
    <AuthContext.Provider value={{ loginUser, logoutUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
