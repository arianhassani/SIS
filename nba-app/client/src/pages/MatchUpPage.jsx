import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Player from '../components/Player';
import PropTypes from 'prop-types';

const positions = [
  'Point Guard',
  'Shooting Guard',
  'Small Forward',
  'Power Forward',
  'Center',
];

const positionAcronyms = ['PG', 'SG', 'SF', 'PF', 'C'];

const positionToPlayerPositionMap = {
  'Point Guard': ['G', 'G-F'],
  'Shooting Guard': ['G', 'G-F'],
  'Small Forward': ['F', 'G-F', 'F-G'],
  'Power Forward': ['F', 'F-C', 'C-F'],
  'Center': ['C', 'C-F', 'F-C'],
};

const MatchUpSelectionPage = () => {
  const navigate = useNavigate();

  const homeTeam = sessionStorage.getItem('homeTeam') || 'No home team selected';
  const awayTeam = sessionStorage.getItem('awayTeam') || 'No away team selected';

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  const getMatchupFromSessionStorage = (team) => {
    const savedMatchup = sessionStorage.getItem(`${team}TeamMatchup`);
    return savedMatchup ? JSON.parse(savedMatchup) : positions.map(() => []);
  };

  const [homeTeamMatchup, setHomeTeamMatchup] = useState(
    getMatchupFromSessionStorage('home'),
  );
  const [awayTeamMatchup, setAwayTeamMatchup] = useState(
    getMatchupFromSessionStorage('away'),
  );

  // State for checkboxes
  const [unrestrictedPositions, setUnrestrictedPositions] = useState(false);
  const [allowInjuredPlayers, setAllowInjuredPlayers] = useState(false);

  useEffect(() => {
    const storedHomePlayers = sessionStorage.getItem(`${homeTeam}HomePlayers`);
    const storedAwayPlayers = sessionStorage.getItem(`${awayTeam}AwayPlayers`);

    setHomePlayers(storedHomePlayers ? JSON.parse(storedHomePlayers) : []);
    setAwayPlayers(storedAwayPlayers ? JSON.parse(storedAwayPlayers) : []);
  }, [homeTeam, awayTeam]);

  const handleAddPlayer = (team, positionIndex, player) => {
    if (team === 'home') {
      const updatedPlayers = [...homeTeamMatchup];
      updatedPlayers[positionIndex] = [player];
      setHomeTeamMatchup(updatedPlayers);
      sessionStorage.setItem('homeTeamMatchup', JSON.stringify(updatedPlayers));
    } else {
      const updatedPlayers = [...awayTeamMatchup];
      updatedPlayers[positionIndex] = [player];
      setAwayTeamMatchup(updatedPlayers);
      sessionStorage.setItem('awayTeamMatchup', JSON.stringify(updatedPlayers));
    }
  };

  const handleDeletePlayer = (team, positionIndex) => {
    if (team === 'home') {
      const updatedPlayers = [...homeTeamMatchup];
      updatedPlayers[positionIndex] = [];
      setHomeTeamMatchup(updatedPlayers);
      sessionStorage.setItem('homeTeamMatchup', JSON.stringify(updatedPlayers));
    } else {
      const updatedPlayers = [...awayTeamMatchup];
      updatedPlayers[positionIndex] = [];
      setAwayTeamMatchup(updatedPlayers);
      sessionStorage.setItem('awayTeamMatchup', JSON.stringify(updatedPlayers));
    }
  };

  const handleBack = () => {
    navigate('/injury-page');
  };

  const handleNextClick = async () => {
    // Check if all positions for both teams are filled
    const isHomeTeamFilled = homeTeamMatchup.every(
      (position) => position.length > 0,
    );
    const isAwayTeamFilled = awayTeamMatchup.every(
      (position) => position.length > 0,
    );

    if (!isHomeTeamFilled || !isAwayTeamFilled) {
      alert(
        'Please fill out all positions for both home and away teams before proceeding.',
      );
      return;
    }

    const homeTeamPlayerIds = homeTeamMatchup
      .flat()
      .map((player) => player._id);
    const awayTeamPlayerIds = awayTeamMatchup
      .flat()
      .map((player) => player._id);

    try {
      // Fetch top performer for the home team
      const homeResponse = await fetch(
        'http://localhost:3000/api/predict/top-performer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playerIds: homeTeamPlayerIds }),
        },
      );

      const homeTopPerformer = await homeResponse.json();

      // Fetch top performer for the away team
      const awayResponse = await fetch(
        'http://localhost:3000/api/predict/top-performer',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ playerIds: awayTeamPlayerIds }),
        },
      );

      const awayTopPerformer = await awayResponse.json();

      // Navigate to the prediction page with both top performers
      navigate('/prediction-page', {
        state: {
          homeTopPerformer,
          awayTopPerformer,
          homeTeamPlayerIds,
          awayTeamPlayerIds,
        },
      });
    } catch (error) {
      console.error('Error fetching top performers:', error);
    }
  };

  const getAvailablePlayers = (
    teamPlayers,
    allPlayers,
    positionIndex,
    teamType,
  ) => {
    const selectedPlayers = teamPlayers.flat();

    let availablePlayers = allPlayers.filter(
      (player) =>
        !selectedPlayers.some((selected) => selected._id === player._id),
    );

    if (!allowInjuredPlayers) {
      availablePlayers = availablePlayers.filter((player) => !player.isInjured);
    }

    if (!unrestrictedPositions) {
      const positionName = positions[positionIndex];
      const acceptablePositions = positionToPlayerPositionMap[positionName];

      availablePlayers = availablePlayers.filter((player) =>
        acceptablePositions.some((pos) => player.position.includes(pos)),
      );
    }

    return availablePlayers;
  };

  return (
    <div className="relative min-h-screen flex flex-col h-full w-full">
      {/* Roster Selection Heading */}
      <div
        className="flex flex-col items-center my-8"
        style={{ marginTop: '2cm', padding: '0 2cm' }}
      >
        <h1 className="text-5xl font-bold mb-4">Match Up Selection</h1>
        <div className="flex items-center space-x-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={unrestrictedPositions}
              onChange={(e) => setUnrestrictedPositions(e.target.checked)}
            />
            Unrestricted Positions
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              className="checkbox mr-2"
              checked={allowInjuredPlayers}
              onChange={(e) => setAllowInjuredPlayers(e.target.checked)}
            />
            Allow Injured Players
          </label>
        </div>
      </div>

      <div className="flex w-full max-w-6xl mx-auto flex-grow">
        <div className="w-1/3 p-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Home Team: {homeTeam}
          </h2>
        </div>
        <div className="w-1/3 p-4 flex items-center justify-center">
          <h2 className="text-3xl font-bold">Starters</h2>
        </div>
        <div className="w-1/3 p-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Away Team: {awayTeam}
          </h2>
        </div>
      </div>

      {/* Positions and Player Selections */}
      <div className="flex flex-col w-full max-w-6xl mx-auto flex-grow">
        {positions.map((position, index) => (
          <div key={index} className="flex w-full items-center mb-4">
            {/* Home Team Player Selection */}
            <div className="w-1/3 p-4">
              {homeTeamMatchup[index].length === 0 ? (
                <AddPlayerForm
                  onAddPlayer={(player) => handleAddPlayer('home', index, player)}
                  availablePlayers={getAvailablePlayers(
                    homeTeamMatchup,
                    homePlayers,
                    index,
                    'home',
                  )}
                />
              ) : (
                <Player
                  player={homeTeamMatchup[index][0].name}
                  onDelete={() => handleDeletePlayer('home', index)}
                />
              )}
            </div>

            {/* Position Acronym */}
            <div className="w-1/3 p-4 flex items-center justify-center">
              <h3 className="text-xl font-semibold">{positionAcronyms[index]}</h3>
            </div>

            {/* Away Team Player Selection */}
            <div className="w-1/3 p-4">
              {awayTeamMatchup[index].length === 0 ? (
                <AddPlayerForm
                  onAddPlayer={(player) => handleAddPlayer('away', index, player)}
                  availablePlayers={getAvailablePlayers(
                    awayTeamMatchup,
                    awayPlayers,
                    index,
                    'away',
                  )}
                />
              ) : (
                <Player
                  player={awayTeamMatchup[index][0].name}
                  onDelete={() => handleDeletePlayer('away', index)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center py-10 mt-8 space-x-5">
        <button className="btn border-white text-white" onClick={handleBack}>
          Back
        </button>
        <button className="btn border-white text-white" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
};

const AddPlayerForm = ({ onAddPlayer, availablePlayers }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [error, setError] = useState('');

  const handleSelectChange = (event) => {
    const playerId = event.target.value;
    if (playerId) {
      const player = availablePlayers.find((p) => p._id === playerId);
      if (player) {
        onAddPlayer(player);
        setSelectedPlayer('');
        setError('');
      } else {
        setError('Player is already selected for another position.');
      }
    }
  };

  return (
    <div className="flex items-center mt-2 w-full">
      <select
        value={selectedPlayer}
        onChange={handleSelectChange}
        className="select select-bordered mr-2 w-full"
      >
        <option value="" disabled>
          Select Player
        </option>
        {availablePlayers.map((player) => (
          <option key={player._id} value={player._id}>
            {player.name} ({player.position}
            {player.isInjured ? ' - Injured' : ''})
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 ml-2">{error}</p>}
    </div>
  );
};

AddPlayerForm.propTypes = {
  onAddPlayer: PropTypes.func.isRequired,
  availablePlayers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      isInjured: PropTypes.bool.isRequired,
    }),
  ).isRequired,
};

export default MatchUpSelectionPage;
