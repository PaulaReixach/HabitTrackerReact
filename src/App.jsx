import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import DashboardPage from "./pages/DashboardPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <div className="page">
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Navbar />

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;