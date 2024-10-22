import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopPerformer from '../components/TopPerformer';

const PredictionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = useState("SELECT SEASON");
  const { homeTeam = "No home team selected", awayTeam = "No away team selected", season } = location.state || {};

  const { leftValue, rightValue } = location.state || {};

  const leftLogo = 'path/to/left-team-logo.png'; // Replace with actual logo path
  const rightLogo = 'path/to/right-team-logo.png'; // Replace with actual logo path


  const predictedScores = {
    left: 100, // Replace with actual predicted score
    right: 98, // Replace with actual predicted score
  };

  const handleBack = () => {
    navigate('/matchup', { state: { leftValue, rightValue } });
  };

  const handleModelSelect = () => {
    setSelectedModel(model);
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Heading */}
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold">Prediction Scores</h1>
        <p>Season: {season}</p>
      </div>

      {/* Prediction Box */}
      <div className="flex flex-col md:flex-row justify-around items-center mb-8 space-y-4 md:space-y-0">
        {/* Left Team */}
        <div className="text-center">
          <img
            src={leftLogo}
            alt={`${homeTeam} logo`}
            className="w-24 h-24 mx-auto"
          />
          <h2 className="text-2xl font-bold">{homeTeam}</h2>
          <div className="text-4xl font-bold md:hidden">{predictedScores.left}</div> {/* Show score here for small screens */}
        </div>

        {/* Scores */}
        <div className="hidden md:block text-4xl font-bold">{predictedScores.left}</div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">VS</h2>
        </div>
        <div className="hidden md:block text-4xl font-bold">{predictedScores.right}</div>
        
        {/* Right Team */}
        <div className="text-center">
          <img
            src={rightLogo}
            alt={`${awayTeam} logo`}
            className="w-24 h-24 mx-auto"
          />
          <h2 className="text-2xl font-bold">{awayTeam}</h2>
          <div className="text-4xl font-bold md:hidden">{predictedScores.right}</div> {/* Show score here for small screens */}
        </div>
      </div>

      {/* Dropdown */}
      <div className="form-control w-full max-w-xs mx-auto mb-8">
        <label className="label">
          <span className="label-text">Choose Model</span>
        </label>
        <select className="select select-bordered">
          <option>Model 1</option>
          <option>Model 2</option>
        </select>
      </div>

      {/* Top Performers */}
      <div className="card bg-base-300 rounded-box p-4 w-full">
        <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4 justify-between">
          {/* Top Performer 1 */}
          <div className="flex-grow grid place-items-center p-4">
            <h3 className="text-xl font-semibold mb-4">{`${homeTeam} Top Performer`}</h3>
            <TopPerformer/>
          </div>
          {/* Top Performer 2 */}
          <div className="flex-grow grid place-items-center p-4">
            <h3 className="text-xl font-semibold mb-4">{`${awayTeam} Top Performer`}</h3>
            <TopPerformer/>
          </div>
        </div>
      </div>

      {/* Statistics Container: 4 Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Left: Team 1 Graph */}
        <div className="card shadow-lg bg-base-100 p-4">
          <div className="card-body">
            <h3 className="card-title">{`${homeTeam} Overall Performer`}</h3>
            {/* Placeholder for Graph */}
            <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Top Right: Team 2 Graph */}
        <div className="card shadow-lg bg-base-100 p-4">
          <div className="card-body">
            <h3 className="card-title">{`${awayTeam} Overall Performance`}</h3>
            {/* Placeholder for Graph */}
            <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Bottom Left: Team 1 Top Performer Scatterplot */}
        <div className="card shadow-lg bg-base-100 p-4">
          <div className="card-body">
            <h3 className="card-title">{`${homeTeam} Top Performer Scatterplot`}</h3>
            {/* Placeholder for Scatterplot */}
            <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Bottom Right: Team 2 Top Performer Scatterplot */}
        <div className="card shadow-lg bg-base-100 p-4">
          <div className="card-body">
            <h3 className="card-title">{`${homeTeam} Top Performer Scatterplot`}</h3>
            {/* Placeholder for Scatterplot */}
            <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;
