import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import DonationsPage from "./pages/DonationsPage";
import CampaignsPage from "./pages/CampaignsPage";
import QuizPage from "./pages/QuizPage";
import RulesPage from "./pages/RulesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { DashboardProvider } from "./context/DashboardContext";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <BrowserRouter>
          <Routes>
            {/* Rota Pública */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rotas Privadas (Corrigido) */}
            {/* O PrivateRoute verifica se está logado. Se sim, renderiza o <Outlet /> */}
            <Route element={<PrivateRoute />}>
              {/* O MainLayout é renderizado e o <Outlet /> dele renderiza as páginas filhas */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/doacoes" element={<DonationsPage />} />
                <Route path="/campanhas" element={<CampaignsPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/regras" element={<RulesPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
              </Route>
            </Route>

          </Routes>
        </BrowserRouter>
      </DashboardProvider>
    </AuthProvider>
  );
}
export default App;
