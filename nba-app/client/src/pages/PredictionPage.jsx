import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PredictionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leftValue, rightValue } = location.state || {};
  const leftLogo = 'path/to/left-team-logo.png'; // Replace with actual logo path
  const rightLogo = 'path/to/right-team-logo.png'; // Replace with actual logo path
  const predictedScores = {
    left: 100, // Replace with actual predicted score
    right: 98, // Replace with actual predicted score
  };

  const [selectedTeam, setSelectedTeam] = useState('Mav');
  const last5Games = ['W', 'L', 'W', 'W', 'L']; // Example data
  const avgPpt = 102.5; // Example data

  const handleBack = () => {
    navigate('/matchup', { state: { leftValue, rightValue } });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold">Predicted Final Score</h1>
      </div>
      <div className="flex justify-around items-center mb-8">
        <div className="text-center">
          <img src={leftLogo} alt={`${leftValue} logo`} className="w-24 h-24 mx-auto" />
          <h2 className="text-2xl font-bold">{leftValue}</h2>
          <p className="text-xl">{predictedScores.left}</p>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">VS</h2>
        </div>
        <div className="text-center">
          <img src={rightLogo} alt={`${rightValue} logo`} className="w-24 h-24 mx-auto" />
          <h2 className="text-2xl font-bold">{rightValue}</h2>
          <p className="text-xl">{predictedScores.right}</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-8">
        {['Q1', 'Q2', 'Q3', 'Q4', 'Final'].map((quarter, index) => (
          <button key={index} className="btn btn-primary">
            {quarter}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto mb-8">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {Array.from({ length: 10 }, (_, i) => (
                <th key={i}>Col {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }, (_, i) => (
              <tr key={i}>
                {Array.from({ length: 10 }, (_, j) => (
                  <td key={j}>Row {i + 1}, Col {j + 1}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Historical Statistics</h2>
        <div className="flex">
          <div className="w-1/3">
            <img src="path/to/historical-image.png" alt="Historical" className="w-full" /> {/* Replace with actual image path */}
          </div>
          <div className="w-2/3 pl-4">
            <div className="flex justify-between items-center mb-4">
              <button
                className={`btn ${selectedTeam === 'Mav' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedTeam('Mav')}
              >
                Mav
              </button>
              <button
                className={`btn ${selectedTeam === 'Cel' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedTeam('Cel')}
              >
                Cel
              </button>
            </div>
            <p className="text-xl mb-4">VS {selectedTeam === 'Mav' ? 'Cel' : 'Mav'} - Last 5 games</p>
            <div className="flex mb-4">
              {last5Games.map((result, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 mx-1 ${result === 'W' ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
              ))}
            </div>
            <p className="text-xl">Average Points Per Game: {avgPpt}</p>
          </div>
        </div>
      </div>
      <button className="btn btn-secondary mt-8" onClick={handleBack}>
        Back
      </button>
    </div>
  );
};

export default PredictionPage;
