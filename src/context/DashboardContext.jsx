import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState({
    capibasBalance: 20,
    lastDonationDate: "2025-10-01T10:00:00Z",
  });

  const addCapibas = (amount) => {
    setDashboardData((prev) => ({
      ...prev,
      capibasBalance: prev.capibasBalance + amount,
      lastDonationDate: new Date().toISOString(),
    }));
  };

  return (
    <DashboardContext.Provider value={{ dashboardData, addCapibas }}>
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
