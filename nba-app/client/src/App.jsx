import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeamSelectionPage from "./pages/TeamSelectionPage";
import InjuryPage from "./pages/InjuryPage";

const App = () => {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/team-selection" element={<TeamSelectionPage />} />
          <Route path="/injury" element={<InjuryPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
