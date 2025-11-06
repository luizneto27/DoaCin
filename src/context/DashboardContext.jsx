import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState({
    capibasBalance: 0, //inicia zerado
    lastDonationDate: null, //inicia nulo
  });

  const addCapibas = (amount) => {
    setDashboardData((prev) => ({
      ...prev,
      capibasBalance: prev.capibasBalance + amount,
      lastDonationDate: new Date().toISOString(),
    }));
  };

  return (
    <DashboardContext.Provider value={{ dashboardData, addCapibas, setDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
