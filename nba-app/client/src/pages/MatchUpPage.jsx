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

const MatchUpSelectionPage = () => {
  const navigate = useNavigate();

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  // Retrieve the team names from session storage or use fallback values
  const homeTeam =
    sessionStorage.getItem('homeTeam') || 'No home team selected';
  const awayTeam =
    sessionStorage.getItem('awayTeam') || 'No home team selected';

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

  useEffect(() => {
    const fetchPlayers = async (teamName, setPlayers) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/teams/${teamName}/players`,
        );
        const data = await response.json();
        setPlayers(data.players || []);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    if (homeTeam !== 'No home team selected') {
      fetchPlayers(homeTeam, setHomePlayers);
    }

    if (awayTeam !== 'No away team selected') {
      fetchPlayers(awayTeam, setAwayPlayers);
    }
  }, [homeTeam, awayTeam]);

  const handleAddPlayer = (team, positionIndex, player) => {
    if (team === 'home') {
      const updatedPlayers = [...homeTeamMatchup];
      updatedPlayers[positionIndex].push(player);
      setHomeTeamMatchup(updatedPlayers);
      sessionStorage.setItem('homeTeamMatchup', JSON.stringify(updatedPlayers));
    } else {
      const updatedPlayers = [...awayTeamMatchup];
      updatedPlayers[positionIndex].push(player);
      setAwayTeamMatchup(updatedPlayers);
      sessionStorage.setItem('awayTeamMatchup', JSON.stringify(updatedPlayers));
    }
  };

  const handleDeletePlayer = (team, positionIndex, playerIndex) => {
    if (team === 'home') {
      const updatedPlayers = [...homeTeamMatchup];
      updatedPlayers[positionIndex].splice(playerIndex, 1);
      setHomeTeamMatchup(updatedPlayers);
      sessionStorage.setItem('homeTeamMatchup', JSON.stringify(updatedPlayers));
    } else {
      const updatedPlayers = [...awayTeamMatchup];
      updatedPlayers[positionIndex].splice(playerIndex, 1);
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

  const getAvailablePlayers = (teamPlayers, allPlayers) => {
    const selectedPlayers = teamPlayers.flat();
    return allPlayers.filter(
      (player) =>
        !selectedPlayers.some((selected) => selected._id === player._id),
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col h-full w-full">
      {/* Roster Selection Heading */}
      <div className="text-center my-8" style={{ marginTop: '2cm' }}>
        <h1 className="text-5xl font-bold">Match Up Selection</h1>
      </div>
      <div className="flex justify-between w-full max-w-4xl mx-auto flex-grow">
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Home Team: {homeTeam}
          </h2>
          {positions.map((position, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{position}</h3>
              <ul>
                {homeTeamMatchup[index].map((player, playerIndex) => (
                  <Player
                    key={playerIndex}
                    player={player.name}
                    onDelete={() =>
                      handleDeletePlayer('home', index, playerIndex)
                    }
                  />
                ))}
              </ul>
              {homeTeamMatchup[index].length === 0 && (
                <AddPlayerForm
                  onAddPlayer={(player) =>
                    handleAddPlayer('home', index, player)
                  }
                  availablePlayers={getAvailablePlayers(
                    homeTeamMatchup,
                    homePlayers,
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-10 text-center">
            Away Team: {awayTeam}
          </h2>
          {positions.map((position, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{position}</h3>
              <ul>
                {awayTeamMatchup[index].map((player, playerIndex) => (
                  <Player
                    key={playerIndex}
                    player={player.name}
                    onDelete={() =>
                      handleDeletePlayer('away', index, playerIndex)
                    }
                  />
                ))}
              </ul>
              {awayTeamMatchup[index].length === 0 && (
                <AddPlayerForm
                  onAddPlayer={(player) =>
                    handleAddPlayer('away', index, player)
                  }
                  availablePlayers={getAvailablePlayers(
                    awayTeamMatchup,
                    awayPlayers,
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Buttons */}
      <div className="flex justify-center py-10 mt-8 space-x-5">
        <button className="btn btn-secondary btn-outline" onClick={handleBack}>
          Back
        </button>
        <button
          className="btn btn-primary btn-outline"
          onClick={handleNextClick}
        >
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
            {player.name}
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
    }),
  ).isRequired,
};

export default MatchUpSelectionPage;
