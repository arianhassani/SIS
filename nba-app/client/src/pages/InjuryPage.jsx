import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InjuryReport from '../components/InjuryReport';

const InjuryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract the team names from location state or use fallback values
  const { homeTeam = "No home team selected", awayTeam = "No away team selected" } = location.state || {};

  // State to track injuries and modal visibility
  const [injuries, setInjuries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form state for adding an injury
  const [player, setPlayer] = useState('');
  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');
  const [teamType, setTeamType] = useState(''); // Home or Away team

  // Function to add a new injury
  const handleAddInjury = () => {
    if (player && result && description && teamType) {
      const selectedTeam = teamType === 'home' ? homeTeam : awayTeam;
      setInjuries([...injuries, { team: selectedTeam, player, result, description, resolved: false }]);
      setShowModal(false); // Close the modal after adding the injury
      setPlayer(''); // Reset the form
      setResult('');
      setDescription('');
      setTeamType('');
    }
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

  // Placeholder image URL (this could be replaced with real player images in the future)
  const placeholderImage = 'https://via.placeholder.com/150'; // Placeholder image URL

  // Filter injuries for home and away teams
  const homeInjuries = injuries.filter(injury => injury.team === homeTeam);
  const awayInjuries = injuries.filter(injury => injury.team === awayTeam);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col w-full">
      {/* Roster Selection Heading */}
      <div className="text-center" style={{ marginTop: '2cm' }}>
        <h1 className="text-xl">Roster Selection</h1>
      </div>

      {/* Live Roster Updates Heading */}
      <div className="text-center my-8" style={{ marginTop: '1.5cm' }}>
        <h1 className="text-xl">Live Roster Updates</h1>
      </div>

      {/* Rectangle with "Injury Reports" text inside and Add button */}
      <div
        className="w-full bg-gray-700 flex justify-between items-center"
        style={{
          height: '1.7cm',
          marginTop: '0.5cm',
          paddingLeft: '1.3cm',
          paddingRight: '1.3cm',
        }}
      >
        <span className="text-white text-lg">Injury Reports</span>
        <button
          className="bg-gray-800 text-white py-1 px-3 rounded"
          onClick={() => setShowModal(true)} // Open the modal when clicked
        >
          + Add Injury
        </button>
      </div>

      {/* Home Team Injuries */}
      <div className="mt-4" style={{ marginTop: '1cm' }}> {/* Added marginTop of 1cm */}
        <h2 className="text-2xl font-bold mb-4 text-center">Home Team: {homeTeam}</h2>
        {homeInjuries.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {homeInjuries.map((injury, index) => (
              <div key={index} className="p-4 rounded">
                {/* Player Photo */}
                <img src={placeholderImage} alt={injury.player} className="w-32 h-32 mx-auto mb-4 rounded-full" />
                {/* Player Name */}
                <h3 className="font-bold text-center">Player: {injury.player}</h3>
                {/* Description */}
                <p className="text-center mt-2">{injury.description}</p>
                <button
                  className="btn btn-sm btn-success mt-2 mx-auto block"
                  onClick={() => handleResolveInjury(index)}
                >
                  Mark as Resolved
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No injuries reported for the Home Team.</p>
        )}
      </div>

      {/* Away Team Injuries, spaced 3cm below Home Team Injuries */}
      <div className="mt-12" style={{ marginTop: '3cm' }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Away Team: {awayTeam}</h2>
        {awayInjuries.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {awayInjuries.map((injury, index) => (
              <div key={index} className="p-4 rounded">
                {/* Player Photo */}
                <img src={placeholderImage} alt={injury.player} className="w-32 h-32 mx-auto mb-4 rounded-full" />
                {/* Player Name */}
                <h3 className="font-bold text-center">Player: {injury.player}</h3>
                {/* Description */}
                <p className="text-center mt-2">{injury.description}</p>
                <button
                  className="btn btn-sm btn-success mt-2 mx-auto block"
                  onClick={() => handleResolveInjury(index)}
                >
                  Mark as Resolved
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No injuries reported for the Away Team.</p>
        )}
      </div>

      {/* Modal for adding an injury */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl mb-4">Add Injury</h2>
            <div className="mb-4">
              <select
                value={teamType}
                onChange={(e) => setTeamType(e.target.value)}
                className="select select-bordered w-full mb-4"
              >
                <option value="" disabled>Select Team</option>
                <option value="home">Home Team: {homeTeam}</option>
                <option value="away">Away Team: {awayTeam}</option>
              </select>
              <input
                type="text"
                placeholder="Player"
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                className="input input-bordered w-full mb-2"
              />
              <input
                type="text"
                placeholder="Result"
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="input input-bordered w-full mb-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input input-bordered w-full mb-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-primary mr-2"
                onClick={handleAddInjury}
              >
                Add
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)} // Close modal without adding
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center">
        <button className="btn btn-secondary mt-8" onClick={handleBack}>
          Back
        </button>
      </div>

     
    </div>
  );
};

export default InjuryPage;
