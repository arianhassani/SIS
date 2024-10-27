import { useState, useEffect } from 'react';
import Player from '../components/MatchUpPlayer';
import AddPlayerForm from '../components/AddPlayerForm';
import PropTypes from 'prop-types';

const positions = [
  'Point Guard',
  'Shooting Guard',
  'Small Forward',
  'Power Forward',
  'Center',
];

const MatchUp = ({ teamName, teamType, setTeamMatchup }) => {
  const [players, setPlayers] = useState([]);
  const [teamMatchup, setTeamMatchupState] = useState(() => {
    const savedMatchup = localStorage.getItem(`${teamType}TeamMatchup`);
    return savedMatchup ? JSON.parse(savedMatchup) : positions.map(() => []);
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/${teamName}/players`,
        );
        const data = await response.json();
        setPlayers(data.players || []);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    if (teamName !== 'No team selected') {
      fetchPlayers();
    }
  }, [teamName]);

  const handleAddPlayer = (positionIndex, player) => {
    const updatedPlayers = [...teamMatchup];
    updatedPlayers[positionIndex].push(player);
    setTeamMatchupState(updatedPlayers);
    localStorage.setItem(
      `${teamType}TeamMatchup`,
      JSON.stringify(updatedPlayers),
    );
    setTeamMatchup(updatedPlayers);
  };

  const handleDeletePlayer = (positionIndex, playerIndex) => {
    const updatedPlayers = [...teamMatchup];
    updatedPlayers[positionIndex].splice(playerIndex, 1);
    setTeamMatchupState(updatedPlayers);
    localStorage.setItem(
      `${teamType}TeamMatchup`,
      JSON.stringify(updatedPlayers),
    );
    setTeamMatchup(updatedPlayers);
  };

  const getAvailablePlayers = () => {
    const selectedPlayers = teamMatchup.flat();
    return players.filter(
      (player) =>
        !selectedPlayers.some((selected) => selected._id === player._id),
    );
  };

  return (
    <div className="w-1/2 p-4">
      <h2 className="text-2xl font-bold mb-4">
        {teamType === 'home' ? 'Home Team' : 'Away Team'}: {teamName}
      </h2>
      {positions.map((position, index) => (
        <div key={index} className="mb-4">
          <h3 className="text-xl font-semibold">{position}</h3>
          <ul>
            {teamMatchup[index].map((player, playerIndex) => (
              <Player
                key={playerIndex}
                player={player.name}
                onDelete={() => handleDeletePlayer(index, playerIndex)}
              />
            ))}
          </ul>
          {teamMatchup[index].length === 0 && (
            <AddPlayerForm
              onAddPlayer={(player) => handleAddPlayer(index, player)}
              availablePlayers={getAvailablePlayers()}
            />
          )}
        </div>
      ))}
    </div>
  );
};

MatchUp.propTypes = {
  teamName: PropTypes.string.isRequired,
  teamType: PropTypes.string.isRequired,
  setTeamMatchup: PropTypes.func.isRequired,
};

export default MatchUp;
