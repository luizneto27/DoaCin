import React, { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext();

function getInitialDashboardData() {
  try {
    const saved = localStorage.getItem("dashboardData");
    if (saved) return JSON.parse(saved);
  } catch (err) {
    void err; // ignore parse errors and satisfy linter
  }
  return {
    capibasBalance: 0, //inicia zerado
    lastDonationDate: null, //inicia nulo
  };
}

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(getInitialDashboardData);

  // persist to localStorage whenever dashboardData changes
  useEffect(() => {
    try {
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    } catch (err) {
      void err; // ignore storage errors and satisfy linter
    }
  }, [dashboardData]);

  const addCapibas = (amount) => {
    setDashboardData((prev) => ({
      ...prev,
      capibasBalance: prev.capibasBalance + amount,
      lastDonationDate: new Date().toISOString(),
    }));
  };

  return (
    <DashboardContext.Provider
      value={{ dashboardData, addCapibas, setDashboardData }}
    >
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
