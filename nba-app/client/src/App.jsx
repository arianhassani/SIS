import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TeamSelectionPage from "./pages/TeamSelectionPage";
import InjuryPage from "./pages/InjuryPage";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<TeamSelectionPage />} />
          <Route path="/team-selection" element={<TeamSelectionPage />} />
          <Route path="/injury" element={<InjuryPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
