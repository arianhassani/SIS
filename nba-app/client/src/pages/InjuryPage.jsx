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
    </div>
  );
};

export default InjuryPage;
