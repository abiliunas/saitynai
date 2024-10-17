import React, { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import agent from "../api/agent";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getCurrentUser = async () => {
    const userId = window.localStorage.getItem("currentUserId");

    if (userId) {
      try {
        const response = await agent.User.currentUser(userId);

        console.log("current user", response);
        setUser(response);

        return response;
      } catch (err) {
        console.log(err);
        return null;
      }
    }
  };

  const login = async (userData) => {
    try {
      const response = await agent.User.login(userData);
      window.localStorage.setItem("currentUserId", response.userId);
      setUser(response);

      return response;
    } catch (err) {
      toast.error("Neteisingas prisijungimo vartotojo vardas arba slaptažodis");
      console.log(err);
      return null;
    }
  };

  const register = async (userData) => {
    try {
      const response = await agent.User.register(userData);
      window.localStorage.setItem("currentUserId", response.userId);
      setUser(response);

      return response;
    } catch (err) {
      toast.error(err.message);
      console.log(err);
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("currentUserId");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
