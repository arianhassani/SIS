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
