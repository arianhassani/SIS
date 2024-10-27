import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import TeamSelectionPage from "./pages/TeamSelectionPage";
import InjuryPage from "./pages/InjuryPage";
import Footer from "./components/Footer";
import MatchUpSelectionPage from "./pages/MatchUpPage";
import PredictionPage from "./pages/PredictionPage";
import ProtectedRoute from "./components/ProtectedRoute";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<TeamSelectionPage />} />
        <Route
          path='/injury-page'
          element={
            <ProtectedRoute requiredKeys={["homeTeam", "awayTeam"]}>
              <InjuryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/matchup-page'
          element={
            <ProtectedRoute requiredKeys={["homeTeam", "awayTeam"]}>
              <MatchUpSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/prediction-page'
          element={
            <ProtectedRoute
              requiredKeys={[
                "homeTeam",
                "awayTeam",
                "homeTeamMatchup",
                "awayTeamMatchup",
              ]}
            >
              <PredictionPage />
            </ProtectedRoute>
          }
        />
        {/* Catch-All Route */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
