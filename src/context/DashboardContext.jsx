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
    birthDate: null,
    weight: null,
    email: null,
    nome: null,
    donationCountLastYear: 0,
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
    // Atualiza o estado local para refletir a mudança imediatamente (Optimistic UI)
    setDashboardData((prev) => ({
      ...prev,
      capibasBalance: (prev.capibasBalance || 0) + amount, // Soma os pontos
      donationCountLastYear: (prev.donationCountLastYear || 0) + 1, // Incrementa contagem de doações
      lastDonationDate: new Date().toISOString(), // Atualiza a data da última doação
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