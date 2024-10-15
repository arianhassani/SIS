import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InjuryReport from '../components/InjuryReport';

const InjuryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leftValue, rightValue } = location.state || {};
  const [injuries, setInjuries] = useState([]);

  const handleAddInjury = (team, player, result, description) => {
    setInjuries([...injuries, { team, player, result, description, resolved: false }]);
  };

  const handleEditInjury = (index, updatedInjury) => {
    const updatedInjuries = injuries.map((injury, i) => (i === index ? updatedInjury : injury));
    setInjuries(updatedInjuries);
  };

  const handleResolveInjury = (index) => {
    const updatedInjuries = injuries.map((injury, i) =>
      i === index ? { ...injury, resolved: true } : injury
    );
    setInjuries(updatedInjuries);
  };

  const handleBack = () => {
    navigate('/', { state: { leftValue, rightValue } });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold">Injury Page</h1>
      </div>
      <div className="flex justify-between w-full max-w-4xl mx-auto">
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Home Team: {leftValue}</h2>
          <InjuryReport
            team={leftValue}
            injuries={injuries.filter(injury => injury.team === leftValue)}
            onAddInjury={handleAddInjury}
            onEditInjury={handleEditInjury}
            onResolveInjury={handleResolveInjury}
          />
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Away Team: {rightValue}</h2>
          <InjuryReport
            team={rightValue}
            injuries={injuries.filter(injury => injury.team === rightValue)}
            onAddInjury={handleAddInjury}
            onEditInjury={handleEditInjury}
            onResolveInjury={handleResolveInjury}
          />
        </div>
      </div>
      <button className="btn btn-secondary mt-8" onClick={handleBack}>
        Back
      </button>
import React from "react";
import { useLocation } from "react-router-dom";

const InjuryPage = () => {
  const location = useLocation();
  const homeTeam = location.state?.homeTeam || "No home team selected"; // Fallback if no home team is selected
  const awayTeam = location.state?.awayTeam || "No away team selected"; // Fallback if no away team is selected

  return (
    <div>
      <h1 className="text-center mt-[2cm] text-xl font-bold">Roster Selection</h1>
      <h1 className="text-center mt-[1.5cm] text-xl">Live Roster Updates</h1>

      {/* Rectangle 2cm below "Live Roster Updates", with same color as Navbar */}
      <div className="mt-[2cm] w-full h-[2cm] bg-gray-700 flex justify-between items-center px-[1cm]">
        {/* Left-side text */}
        <span className="text-lg text-white">Injury Reports</span>

        {/* Right-side button with darker color */}
        <button className="bg-gray-800 text-white py-1 px-3 rounded">+Add</button>
      </div>

      {/* Display the Home Team name below the rectangle */}
      <h2 className="text-center mt-[1cm] text-xl">Home Team: {homeTeam}</h2>

      {/* Display the Away Team name below the Home Team */}
      <h2 className="text-center mt-[0.5cm] text-xl">Away Team: {awayTeam}</h2>
    </div>
  );
};

export default InjuryPage;
