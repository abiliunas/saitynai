import React, { createContext, useContext } from "react";
import agent from "../api/agent";
import { useAuth } from "./authContext";
import { toast } from "react-toastify";

const FinanceContext = createContext(null);

export const usePersonalFinance = () => {
  return useContext(FinanceContext);
};

export const FinanceProvider = ({ children }) => {
  const { user } = useAuth();

  const deleteFinance = async (id) => {
    try {
      const response = await agent.PersonalFinance.deleteOrder(id);
      toast.success("Biudžeto eiltė ištrinta!");

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const getFinance = async () => {
    try {
      console.log("current user", user);
      const response = await agent.PersonalFinance.getOrders(user.username);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const upsertFinance = async (request) => {
    try {
      console.log("current user", user);
      const response = await agent.PersonalFinance.upsertOrder(request);

      toast.success("Biudžeto eiltė išsaugota!");

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FinanceContext.Provider
      value={{ upsertFinance, getFinance, deleteFinance }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
