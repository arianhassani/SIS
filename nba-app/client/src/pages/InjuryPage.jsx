import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InjuryReport from '../components/InjuryReport';

const InjuryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the team names from location state or use fallback values
  const { homeTeam = "No home team selected", awayTeam = "No away team selected" } = location.state || {};

  // State to track injuries
  const [injuries, setInjuries] = useState([]);

  // Function to add a new injury
  const handleAddInjury = (team, player, result, description) => {
    setInjuries([...injuries, { team, player, result, description, resolved: false }]);
  };

  // Function to edit an existing injury
  const handleEditInjury = (index, updatedInjury) => {
    const updatedInjuries = injuries.map((injury, i) => (i === index ? updatedInjury : injury));
    setInjuries(updatedInjuries);
  };

  // Function to mark an injury as resolved
  const handleResolveInjury = (index) => {
    const updatedInjuries = injuries.map((injury, i) =>
      i === index ? { ...injury, resolved: true } : injury
    );
    setInjuries(updatedInjuries);
  };

  // Navigate back to the previous page
  const handleBack = () => {
    navigate('/', { state: { homeTeam, awayTeam } });
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col w-full"> {/* Match TeamSelectionPage */}
      {/* Roster Selection Heading */}
      <div className="text-center" style={{ marginTop: '2cm' }}> {/* Extra 1cm margin added */}
        <h1 className="text-xl">Roster Selection</h1> {/* Reduced font size and unbolded */}
      </div>

      {/* Existing Content */}
      <div className="text-center my-8" style={{ marginTop: '1.5cm' }}> {/* Extra 1cm margin added */}
        <h1 className="text-xl">Live Roster Updates</h1> {/* Reduced font size and unbolded */}
      </div>

      <div className="flex justify-between w-full max-w-4xl mx-auto">
        {/* Home Team Section */}
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Home Team: {homeTeam}</h2>
          <InjuryReport
            team={homeTeam}
            injuries={injuries.filter(injury => injury.team === homeTeam)}
            onAddInjury={handleAddInjury}
            onEditInjury={handleEditInjury}
            onResolveInjury={handleResolveInjury}
          />
        </div>

        {/* Away Team Section */}
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Away Team: {awayTeam}</h2>
          <InjuryReport
            team={awayTeam}
            injuries={injuries.filter(injury => injury.team === awayTeam)}
            onAddInjury={handleAddInjury}
            onEditInjury={handleEditInjury}
            onResolveInjury={handleResolveInjury}
          />
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button className="btn btn-secondary mt-8" onClick={handleBack}>
          Back
        </button>
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white text-center py-14"> {/* Match footer */}
        <p>&copy; {new Date().getFullYear()} NBA Analytics. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default InjuryPage;
