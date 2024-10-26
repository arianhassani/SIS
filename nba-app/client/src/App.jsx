import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TeamSelectionPage from "./pages/TeamSelectionPage";
import InjuryPage from "./pages/InjuryPage";
import Footer from "./components/Footer";
import MatchUpSelectionPage from "./pages/MatchUpPage";
import PredictionPage from "./pages/PredictionPage";

const App = () => {
  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<TeamSelectionPage />} />
          <Route path="/injury-page" element={<InjuryPage />} />
          <Route path="/matchup-page" element={<MatchUpSelectionPage />} />
          <Route path="/prediction-page" element={<PredictionPage />} />
        </Routes>
        <Footer />
      </Router>
  );
};

export default App;
