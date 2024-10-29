import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const InjuryPage = () => {
  const navigate = useNavigate();

  const [homeTeam, setHomeTeam] = useState(
    sessionStorage.getItem('homeTeam') || 'No home team selected',
  );
  const [awayTeam, setAwayTeam] = useState(
    sessionStorage.getItem('awayTeam') || 'No away team selected',
  );

  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [dropdownExpanded, setDropdownExpanded] = useState({}); // Track dropdown visibility for each player
  const [homePlayers, setHomePlayers] = useState(() => {
    const storedHomePlayers = sessionStorage.getItem(`${homeTeam}HomePlayers`);
    return storedHomePlayers ? JSON.parse(storedHomePlayers) : [];
  });
  const [awayPlayers, setAwayPlayers] = useState(() => {
    const storedAwayPlayers = sessionStorage.getItem(`${awayTeam}AwayPlayers`);
    return storedAwayPlayers ? JSON.parse(storedAwayPlayers) : [];
  });
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState('');
  const [description, setDescription] = useState('');
  const [teamType, setTeamType] = useState('');
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [playerImages, setPlayerImages] = useState({});

  const fetchUpdatedHomePlayers = useCallback(async (homeTeam) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/teams/${homeTeam}/updated-players`,
      );
      const data = await response.json();
      sessionStorage.setItem(`${homeTeam}HomePlayers`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching updated home players:', error);
      return [];
    }
  }, []);

  const fetchUpdatedAwayPlayers = useCallback(async (awayTeam) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/teams/${awayTeam}/updated-players`,
      );
      const data = await response.json();
      sessionStorage.setItem(`${awayTeam}AwayPlayers`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching updated away players:', error);
      return [];
    }
  }, []);

  const initializePlayers = useCallback(
    async (homeTeam, awayTeam) => {
      setLoading(true);

      if (!sessionStorage.getItem(`${homeTeam}HomePlayers`)) {
        const homePlayers = await fetchUpdatedHomePlayers(homeTeam);
        setHomePlayers(homePlayers);
      } else {
        setHomePlayers(
          JSON.parse(sessionStorage.getItem(`${homeTeam}HomePlayers`)),
        );
      }

      if (!sessionStorage.getItem(`${awayTeam}AwayPlayers`)) {
        const awayPlayers = await fetchUpdatedAwayPlayers(awayTeam);
        setAwayPlayers(awayPlayers);
      } else {
        setAwayPlayers(
          JSON.parse(sessionStorage.getItem(`${awayTeam}AwayPlayers`)),
        );
      }

      setLoading(false);
    },
    [fetchUpdatedHomePlayers, fetchUpdatedAwayPlayers],
  );

  useEffect(() => {
    const fetchData = async () => {
      await initializePlayers(homeTeam, awayTeam);
    };

    fetchData();
  }, [homeTeam, awayTeam, initializePlayers]);

  useEffect(() => {
    let players = [];

    if (teamType === 'home') {
      players = homePlayers;
    } else if (teamType === 'away') {
      players = awayPlayers;
    }

    let filteredPlayers;
    if (editMode && selectedPlayerId) {
      // Include all players
      filteredPlayers = players;
    } else {
      filteredPlayers = players.filter((player) => !player.isInjured);
    }

    setAvailablePlayers(filteredPlayers);
  }, [teamType, homePlayers, awayPlayers, editMode, selectedPlayerId]);

  const confirmResolveInjury = (playerId) => {
    setSelectedPlayerId(playerId);
    setShowConfirmation(true);
  };

  const handleResolveInjury = async () => {
    if (!selectedPlayerId) return;

    try {
      await fetch(`http://localhost:3000/api/players/${selectedPlayerId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const homePlayers =
        JSON.parse(sessionStorage.getItem(`${homeTeam}HomePlayers`)) || [];
      const awayPlayers =
        JSON.parse(sessionStorage.getItem(`${awayTeam}AwayPlayers`)) || [];

      const updatePlayerInjuryStatus = (players) => {
        return players.map((player) => {
          if (player._id === selectedPlayerId) {
            return { ...player, isInjured: false, injuryDetails: '' };
          }
          return player;
        });
      };

      const updatedHomePlayers = updatePlayerInjuryStatus(homePlayers);
      const updatedAwayPlayers = updatePlayerInjuryStatus(awayPlayers);

      sessionStorage.setItem(
        `${homeTeam}HomePlayers`,
        JSON.stringify(updatedHomePlayers),
      );
      sessionStorage.setItem(
        `${awayTeam}AwayPlayers`,
        JSON.stringify(updatedAwayPlayers),
      );

      setHomePlayers(updatedHomePlayers);
      setAwayPlayers(updatedAwayPlayers);
      setShowConfirmation(false);
      setSelectedPlayerId(null);
    } catch (error) {
      console.error('Error resolving player injury status:', error);
    }
  };

  const toggleDropdown = (playerId) => {
    setDropdownExpanded((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  const handleEditInjury = (playerId) => {
    setEditMode(true);
    let selectedPlayer = homePlayers.find((p) => p._id === playerId);
    if (selectedPlayer) {
      setTeamType('home');
    } else {
      selectedPlayer = awayPlayers.find((p) => p._id === playerId);
      if (selectedPlayer) {
        setTeamType('away');
      }
    }

    if (selectedPlayer) {
      setPlayer(selectedPlayer.name);
      setDescription(selectedPlayer.injuryDetails || '');
      setSelectedPlayerId(playerId);
      setShowModal(true);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedPlayerId) return;

    try {
      await fetch(`http://localhost:3000/api/players/${selectedPlayerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          injuryDetails: description,
        }),
      });

      const updatePlayerInjuryDetails = (players) => {
        return players.map((player) => {
          if (player._id === selectedPlayerId) {
            return { ...player, injuryDetails: description };
          }
          return player;
        });
      };

      if (teamType === 'home') {
        const updatedHomePlayers = updatePlayerInjuryDetails(homePlayers);
        setHomePlayers(updatedHomePlayers);
        sessionStorage.setItem(
          `${homeTeam}HomePlayers`,
          JSON.stringify(updatedHomePlayers),
        );
      } else if (teamType === 'away') {
        const updatedAwayPlayers = updatePlayerInjuryDetails(awayPlayers);
        setAwayPlayers(updatedAwayPlayers);
        sessionStorage.setItem(
          `${awayTeam}AwayPlayers`,
          JSON.stringify(updatedAwayPlayers),
        );
      }

      setShowModal(false);
      setEditMode(false);
      setSelectedPlayerId(null);
    } catch (error) {
      console.error('Error updating player injury details:', error);
    }
  };

  // Implement the handleAddInjury function
  const handleAddInjury = async () => {
    try {
      let players, setPlayers, teamKey;
      if (teamType === 'home') {
        players = homePlayers;
        setPlayers = setHomePlayers;
        teamKey = `${homeTeam}HomePlayers`;
      } else if (teamType === 'away') {
        players = awayPlayers;
        setPlayers = setAwayPlayers;
        teamKey = `${awayTeam}AwayPlayers`;
      } else {
        return;
      }

      const selectedPlayer = players.find((p) => p.name === player);
      if (!selectedPlayer) return;

      // Update player injury status in backend
      await fetch(`http://localhost:3000/api/players/${selectedPlayer._id}/injure`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          injuryDetails: description,
        }),
      });

      // Update local state
      const updatedPlayers = players.map((p) => {
        if (p._id === selectedPlayer._id) {
          return { ...p, isInjured: true, injuryDetails: description };
        }
        return p;
      });

      setPlayers(updatedPlayers);
      sessionStorage.setItem(teamKey, JSON.stringify(updatedPlayers));
    } catch (error) {
      console.error('Error adding injury:', error);
    }
  };

  const placeholderImage = 'https://placehold.co/400?text=No+Data+Available';

  const homeInjuredPlayers = homePlayers.filter((player) => player.isInjured);
  const awayInjuredPlayers = awayPlayers.filter((player) => player.isInjured);

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      <div className="text-center" style={{ marginTop: '2cm' }}>
        <h1 className="text-5xl font-bold">Roster Selection</h1>
      </div>

      <div className="text-center my-8" style={{ marginTop: '1.5cm' }}>
        <h1 className="text-3xl font-bold">Live Roster Updates</h1>
      </div>

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
          onClick={() => {
            setTeamType('');
            setPlayer('');
            setDescription('');
            setEditMode(false);
            setShowModal(true);
          }}
        >
          + Add Injury
        </button>
      </div>

      <div className="mt-4" style={{ marginTop: '1cm' }}>
        <h2 className={`text-2xl font-bold mb-4 text-center`}>
          {`Home Team: ${homeTeam}`}
        </h2>
        <div className="px-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="p-4 rounded">
                  <div className="skeleton h-32 w-32 mx-auto mb-4 rounded-full"></div>
                  <div className="skeleton h-6 w-24 mx-auto mb-2"></div>
                  <div className="skeleton h-4 w-32 mx-auto"></div>
                  <div className="skeleton h-8 w-24 mx-auto mt-2"></div>
                </div>
              ))}
            </div>
          ) : homeInjuredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {homeInjuredPlayers.map((injury, index) => (
                <div key={index} className="p-4 rounded relative text-center">
                  <img
                    src={playerImages[injury.name] || placeholderImage}
                    alt={injury.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-full"
                  />
                  <h3 className="font-bold">Player: {injury.name}</h3>
                  <div className="mt-2 flex items-center justify-center flex-nowrap">
                    <p className="text-center break-words flex-grow min-w-0 mr-2">
                      {injury.injuryDetails}
                    </p>
                    <button
                      className="bg-gray-700 text-white px-2 py-1 rounded border border-white flex-shrink-0"
                      onClick={() => toggleDropdown(injury._id)}
                    >
                      ▼
                    </button>
                  </div>
                  {dropdownExpanded[injury._id] && (
                    <div
                      className="bg-gray-700 text-white p-[10px] rounded mt-2"
                      style={{ width: '100%' }}
                    >
                      <button
                        className="bg-gray-700 text-white py-1 px-3 rounded w-full mb-2 border border-white"
                        onClick={() => confirmResolveInjury(injury._id)}
                      >
                        Mark as Resolved
                      </button>
                      <button
                        className="bg-gray-700 text-white py-1 px-3 rounded w-full border border-white"
                        onClick={() => handleEditInjury(injury._id)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No injuries reported for the Home Team.</p>
          )}
        </div>
      </div>

      <div className="mt-12" style={{ marginTop: '3cm' }}>
        <h2 className={`text-2xl font-bold mb-4 text-center`}>
          {`Away Team: ${awayTeam}`}
        </h2>
        <div className="px-10">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="p-4 rounded">
                  <div className="skeleton h-32 w-32 mx-auto mb-4 rounded-full"></div>
                  <div className="skeleton h-6 w-24 mx-auto mb-2"></div>
                  <div className="skeleton h-4 w-32 mx-auto"></div>
                  <div className="skeleton h-8 w-24 mx-auto mt-2"></div>
                </div>
              ))}
            </div>
          ) : awayInjuredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {awayInjuredPlayers.map((injury, index) => (
                <div key={index} className="p-4 rounded relative text-center">
                  <img
                    src={playerImages[injury.name] || placeholderImage}
                    alt={injury.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-full"
                  />
                  <h3 className="font-bold">Player: {injury.name}</h3>
                  <div className="mt-2 flex items-center justify-center flex-nowrap">
                    <p className="text-center break-words flex-grow min-w-0 mr-2">
                      {injury.injuryDetails}
                    </p>
                    <button
                      className="bg-gray-700 text-white px-2 py-1 rounded border border-white flex-shrink-0"
                      onClick={() => toggleDropdown(injury._id)}
                    >
                      ▼
                    </button>
                  </div>
                  {dropdownExpanded[injury._id] && (
                    <div
                      className="bg-gray-700 text-white p-[10px] rounded mt-2"
                      style={{ width: '100%' }}
                    >
                      <button
                        className="bg-gray-700 text-white py-1 px-3 rounded w-full mb-2 border border-white"
                        onClick={() => confirmResolveInjury(injury._id)}
                      >
                        Mark as Resolved
                      </button>
                      <button
                        className="bg-gray-700 text-white py-1 px-3 rounded w-full border border-white"
                        onClick={() => handleEditInjury(injury._id)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No injuries reported for the Away Team.</p>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 text-center">
            <h2 className="text-xl mb-4">Are you sure you want to resolve this injury?</h2>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="btn border-white text-white"
                onClick={handleResolveInjury}
              >
                Yes
              </button>
              <button
                className="btn border-white text-white"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding/editing an injury */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl mb-4">{editMode ? 'Edit Injury' : 'Add Injury'}</h2>
            <div className="mb-4">
              <select
                value={teamType}
                onChange={(e) => setTeamType(e.target.value)}
                className="select select-bordered w-full mb-4"
                disabled={editMode}
              >
                <option value="" disabled>
                  Select Team
                </option>
                <option value="home">Home Team: {homeTeam}</option>
                <option value="away">Away Team: {awayTeam}</option>
              </select>
              <select
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                className="select select-bordered w-full mb-4"
                disabled={editMode || !teamType}
              >
                <option value="" disabled>
                  Select Player
                </option>
                {availablePlayers.map((player) => (
                  <option key={player._id} value={player.name}>
                    {player.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input input-bordered w-full mb-2 text-center"
                disabled={!teamType || !player}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn border-white text-white mr-2"
                onClick={async () => {
                  if (editMode) {
                    await handleSaveChanges();
                  } else {
                    await handleAddInjury();
                  }
                  setShowModal(false);
                }}
                disabled={!teamType || !player || !description}
              >
                {editMode ? 'Save Changes' : 'Add'}
              </button>
              <button
                className="btn border-white text-white"
                onClick={() => {
                  setShowModal(false);
                  setEditMode(false);
                  setSelectedPlayerId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center py-10 mt-8 space-x-5">
        <button
          className="btn border-white text-white"
          onClick={() => navigate('/')}
        >
          Back
        </button>
        <button
          className="btn border-white text-white"
          onClick={() => navigate('/matchup-page')}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InjuryPage;
