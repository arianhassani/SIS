import Navbar from "./Components/Navbar/Navbar"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeamSelectionPage from "./Components/TeamSelection/TeamSelectionPage";
import InjuryPage from "./Components/InjuryPage/InjuryPage";
const App = () => {
  return (
    <div>
      <Router>
      <Navbar />
      <Routes>
        <Route path="/TeamSelection" element={<TeamSelectionPage />} />
        <Route path="/Injury" element={<InjuryPage />} />
      </Routes>


      </Router>
    </div>
    
  )
}

export default App