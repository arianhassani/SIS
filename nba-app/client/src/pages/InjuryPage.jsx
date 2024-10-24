import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const InjuryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { homeTeam = "No home team selected", awayTeam = "No away team selected", homeTeamId, awayTeamId } = location.state || {};

  const [injuries, setInjuries] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [player, setPlayer] = useState('');
  const [result, setResult] = useState('');
  const [description, setDescription] = useState('');
  const [teamType, setTeamType] = useState('');
  const [minutesRestricted, setMinutesRestricted] = useState('');
  const [injuryDuration, setInjuryDuration] = useState('');
  const [injuryDurationUnit, setInjuryDurationUnit] = useState('');
  const [error, setError] = useState('');
  const [expandedInjury, setExpandedInjury] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);

  const fetchPlayers = async (teamName) => {
    if (!teamName) {
      setError('Team name is invalid');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/${teamName}/players`);
      if (!response.ok) {
        throw new Error('Failed to fetch players from server');
      }
      const data = await response.json();
      if (data.players && data.players.length > 0) {
        setPlayers(data.players);
        setError('');
      } else {
        setError('No players found for the selected team');
        setPlayers([]);
      }
    } catch (error) {
      setError('Error fetching players: ' + error.message);
    }
  };

  const handleTeamSelection = (team) => {
    setTeamType(team);
    if (team === 'home') {
      fetchPlayers(homeTeam);
    } else if (team === 'away') {
      fetchPlayers(awayTeam);
    }
  };

  const handleAddOrEditInjury = () => {
    if (player && result && description && teamType) {
      const selectedTeam = teamType === 'home' ? homeTeam : awayTeam;
      let injuryDetail;
      if (result === 'GTD (Game Time Decision)') {
        injuryDetail = `${minutesRestricted} minutes per game`;
      } else if (result === 'INJ (Injury)') {
        injuryDetail = `Out for ${injuryDuration} ${injuryDurationUnit}`;
      }

      const newInjury = {
        team: selectedTeam,
        player,
        result: result === 'GTD (Game Time Decision)' ? 'Game Time Decision' : 'Injury',
        description,
        injuryDetail,
        resolved: false,
      };

      if (editingIndex !== null) {
        const updatedInjuries = [...injuries];
        updatedInjuries[editingIndex] = newInjury;
        setInjuries(updatedInjuries);
      } else {
        setInjuries([...injuries, newInjury]);
      }

      resetForm();
    }
  };

  const handleResolveInjury = (index) => {
    if (window.confirm("Are you sure you want to resolve this injury?")) {
      const updatedInjuries = injuries.filter((_, i) => i !== index);
      setInjuries(updatedInjuries);
    }
  };

  const handleEditInjury = (injury, index) => {
    setEditingIndex(index);
    setPlayer(injury.player);
    setResult(injury.result === 'Game Time Decision' ? 'GTD (Game Time Decision)' : 'INJ (Injury)');
    setDescription(injury.description);
    setTeamType(injury.team === homeTeam ? 'home' : 'away');
    setMinutesRestricted(injury.result === 'Game Time Decision' ? injury.injuryDetail.split(' ')[0] : '');
    setInjuryDuration(injury.result === 'Injury' ? injury.injuryDetail.split(' ')[2] : '');
    setInjuryDurationUnit(injury.result === 'Injury' ? injury.injuryDetail.split(' ')[3] : '');
    setShowModal(true);
  };

  const toggleDropdown = (index) => {
    setExpandedInjury(expandedInjury === index ? null : index);
  };

  const resetForm = () => {
    setPlayer('');
    setResult('');
    setDescription('');
    setTeamType('');
    setMinutesRestricted('');
    setInjuryDuration('');
    setInjuryDurationUnit('');
    setShowModal(false);
    setEditingIndex(null);
  };

  const handleNext = () => {
    console.log("Navigating to MatchUp page with:", {
      homeTeam, awayTeam, homeTeamId, awayTeamId
    });

    // Make sure teams are selected before navigating
    if (!homeTeam || !awayTeam) {
      alert('Please make sure to select both home and away teams.');
      return;
    }

    // Navigate to MatchUp page and pass the state
    navigate('/matchup', {
      state: { homeTeam, awayTeam, homeTeamId, awayTeamId }
    });
  };

  const handleBack = () => {
    navigate('/', { state: { homeTeam, awayTeam } });
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col w-full">
      <div className="text-center" style={{ marginTop: '2cm' }}>
        <h1 className="text-xl">Roster Selection</h1>
      </div>

      <div className="text-center my-8" style={{ marginTop: '1.5cm' }}>
        <h1 className="text-xl">Live Roster Updates</h1>
      </div>

      <div className="w-full bg-gray-700 flex justify-between items-center" style={{ height: '1.7cm', marginTop: '0.5cm', paddingLeft: '1.3cm', paddingRight: '1.3cm' }}>
        <span className="text-white text-lg">Injury Reports</span>
        <button className="bg-gray-800 text-white py-1 px-3 rounded" onClick={() => setShowModal(true)}>
          + Add Injury
        </button>
      </div>

      <div className="mt-4" style={{ marginTop: '1cm' }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Home Team: {homeTeam}</h2>
        {injuries.filter(injury => injury.team === homeTeam).length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {injuries.filter(injury => injury.team === homeTeam).map((injury, index) => (
              <div key={index} className="p-4 rounded" style={{ textAlign: 'center' }}>
                <p className="player-name" style={{ marginBottom: '10px', fontWeight: 'normal', fontSize: '16px' }}>
                  {injury.player}
                </p>
                <p className="injury-result" style={{ marginBottom: '2px', fontSize: '14px', fontWeight: 'normal', lineHeight: '1.4' }}>
                  {injury.result}
                </p>
                <p className="injury-description" style={{ marginTop: '0px', fontSize: '14px', lineHeight: '1.2', marginBottom: '12px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                  {injury.description} - {injury.injuryDetail}
                  <div style={{ display: 'inline-block', cursor: 'pointer', marginLeft: '8px' }} onClick={() => toggleDropdown(index)}>
                    ▼
                  </div>
                </p>

                {expandedInjury === index && (
                  <div className="dropdown-content" style={{ marginTop: '4px', width: '100%', textAlign: 'center' }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleResolveInjury(index)}
                    >
                      Resolve
                    </button>
                    <button
                      className="btn btn-sm btn-secondary ml-2"
                      onClick={() => handleEditInjury(injury, index)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : <p className="text-center">No injuries reported for the Home Team.</p>}
      </div>

      <div className="mt-12" style={{ marginTop: '3cm' }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Away Team: {awayTeam}</h2>
        {injuries.filter(injury => injury.team === awayTeam).length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {injuries.filter(injury => injury.team === awayTeam).map((injury, index) => (
              <div key={index} className="p-4 rounded" style={{ textAlign: 'center' }}>
                <p className="player-name" style={{ marginBottom: '10px', fontWeight: 'normal', fontSize: '16px' }}>
                  {injury.player}
                </p>
                <p className="injury-result" style={{ marginBottom: '2px', fontSize: '14px', fontWeight: 'normal', lineHeight: '1.4' }}>
                  {injury.result}
                </p>
                <p className="injury-description" style={{ marginTop: '0px', fontSize: '14px', lineHeight: '1.2', marginBottom: '12px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                  {injury.description} - {injury.injuryDetail}
                  <div style={{ display: 'inline-block', cursor: 'pointer', marginLeft: '8px' }} onClick={() => toggleDropdown(index)}>
                    ▼
                  </div>
                </p>

                {expandedInjury === index && (
                  <div className="dropdown-content" style={{ marginTop: '4px', width: '100%', textAlign: 'center' }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleResolveInjury(index)}
                    >
                      Resolve
                    </button>
                    <button
                      className="btn btn-sm btn-secondary ml-2"
                      onClick={() => handleEditInjury(injury, index)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : <p className="text-center">No injuries reported for the Away Team.</p>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl mb-4">Add/Edit Injury</h2>
            <div className="mb-4">
              <select value={teamType} onChange={(e) => handleTeamSelection(e.target.value)} className="select select-bordered w-full mb-4">
                <option value="" disabled>Select Team</option>
                <option value="home">Home Team: {homeTeam}</option>
                <option value="away">Away Team: {awayTeam}</option>
              </select>

              <select value={player} onChange={(e) => setPlayer(e.target.value)} className="select select-bordered w-full mb-4">
                <option value="" disabled>Select Player</option>
                {players.map((player) => (
                  <option key={player._id} value={player.name}>{player.name}</option>
                ))}
              </select>

              <select value={result} onChange={(e) => setResult(e.target.value)} className="select select-bordered w-full mb-2">
                <option value="" disabled>Select Result</option>
                <option value="GTD (Game Time Decision)">GTD (Game Time Decision)</option>
                <option value="INJ (Injury)">INJ (Injury)</option>
              </select>

              {result === 'GTD (Game Time Decision)' && (
                <input type="text" placeholder="Minutes Restricted" value={minutesRestricted} onChange={(e) => setMinutesRestricted(e.target.value)} className="input input-bordered w-full mb-2" />
              )}

              {result === 'INJ (Injury)' && (
                <>
                  <input type="text" placeholder="Injury Duration" value={injuryDuration} onChange={(e) => setInjuryDuration(e.target.value)} className="input input-bordered w-full mb-2" />
                  <select value={injuryDurationUnit} onChange={(e) => setInjuryDurationUnit(e.target.value)} className="select select-bordered w-full mb-2">
                    <option value="" disabled>Select Unit</option>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </>
              )}

              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input input-bordered w-full mb-2" />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex justify-end">
              <button className="btn btn-primary mr-2" onClick={handleAddOrEditInjury}>Save</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8 mx-4">
        <button className="btn btn-secondary" onClick={handleBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default InjuryPage;
