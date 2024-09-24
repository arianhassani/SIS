import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeamSelectionPage from "./pages/TeamSelectionPage";
import InjuryPage from "./pages/InjuryPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/team-selection" element={<TeamSelectionPage />} />
          <Route path="/injury" element={<InjuryPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
