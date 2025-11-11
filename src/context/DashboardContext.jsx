import React, { createContext, useContext, useState, useEffect } from "react";

const DashboardContext = createContext();

function getInitialDashboardData() {
  try {
    const saved = localStorage.getItem("dashboardData");
    if (saved) return JSON.parse(saved);
  } catch (err) {
    void err; 
  }
  return {
    capibasBalance: 0,
    lastDonationDate: null,
    genero: null, 
    donationCountLastYear: 0,
    birthDate: null,
    weight: null,
    email: null,
    nome: null
  };
}

export function DashboardProvider({ children }) {
  const [dashboardData, setDashboardData] = useState(getInitialDashboardData);


  useEffect(() => {
    try {
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    } catch (err) {
      void err; 
    }
  }, [dashboardData]);

  const addCapibas = (amount) => {
    // Preserva os outros dados (genero, count, etc.) ao simular
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