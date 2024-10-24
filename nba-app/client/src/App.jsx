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
          <Route path="/injury" element={<InjuryPage />} />
          <Route path="/match-up" element={<MatchUpSelectionPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Routes>
        <Footer />
      </Router>
  );
};

export default App;
