import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/HomePage";
import DonationsPage from "./pages/DonationsPage";
import CampaignsPage from "./pages/CampaignsPage";
import QuizPage from "./pages/QuizPage";
import RulesPage from "./pages/RulesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import ValidarQRCode from "./pages/ValidarQRCode";
import { DashboardProvider } from "./context/DashboardContext";
// ... crie um AuthProvider e um PrivateRoute
function App() {
  return (
    // <AuthProvider>
    <DashboardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* Rotas Privadas dentro do Layout Principal */}
          <Route element={<MainLayout />}>
            {" "}
            {/* <PrivateRoute> <MainLayout /> </PrivateRoute> */}
            <Route path="/" element={<HomePage />} />
            <Route path="/doacoes" element={<DonationsPage />} />
            <Route path="/campanhas" element={<CampaignsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/regras" element={<RulesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/validar-qrcode" element={<ValidarQRCode />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DashboardProvider>
    // </AuthProvider>
  );
}
export default App;
