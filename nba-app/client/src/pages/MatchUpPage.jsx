import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Player from '../components/MatchUpPlayer';

const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

const MatchUpSelectionPage = () => {
  const location = useLocation();
  
  // Receive the home and away teams from InjuryPage
  const { homeTeam, awayTeam, homeTeamId, awayTeamId } = location.state || {};

  // If no teams are passed, display an error message
  if (!homeTeam || !awayTeam) {
    return <div>Error: No teams were passed. Please go back and reselect teams.</div>;
  }

  console.log('State received in MatchUpSelectionPage:', { homeTeam, awayTeam, homeTeamId, awayTeamId });

  const [leftTeamPlayers, setLeftTeamPlayers] = useState(positions.map(() => []));
  const [rightTeamPlayers, setRightTeamPlayers] = useState(positions.map(() => []));
  const [leftTeamDropdownPlayers, setLeftTeamDropdownPlayers] = useState([]);
  const [rightTeamDropdownPlayers, setRightTeamDropdownPlayers] = useState([]);

  useEffect(() => {
    // Fetch players for the left (home) team
    fetchPlayersForTeam(homeTeam, setLeftTeamDropdownPlayers);

    // Fetch players for the right (away) team
    fetchPlayersForTeam(awayTeam, setRightTeamDropdownPlayers);
  }, [homeTeam, awayTeam]);

  const fetchPlayersForTeam = async (teamName, setTeamPlayers) => {
    try {
      const response = await fetch(`http://localhost:3000/${teamName}/players`);
      const data = await response.json();
      if (data.players) {
        setTeamPlayers(data.players);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleAddPlayer = (team, positionIndex, player) => {
    if (team === 'left') {
      const updatedPlayers = [...leftTeamPlayers];
      updatedPlayers[positionIndex].push(player);
      setLeftTeamPlayers(updatedPlayers);
    } else {
      const updatedPlayers = [...rightTeamPlayers];
      updatedPlayers[positionIndex].push(player);
      setRightTeamPlayers(updatedPlayers);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold">Match Up Selection</h1>
      </div>
      <div className="flex justify-between w-full max-w-4xl mx-auto">
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Home Team: {homeTeam}</h2>
          {positions.map((position, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{position}</h3>
              <ul>
                {leftTeamPlayers[index].map((player, playerIndex) => (
                  <Player
                    key={playerIndex}
                    player={player}
                    onDelete={() => handleDeletePlayer('left', index, playerIndex)}
                  />
                ))}
              </ul>
              <AddPlayerForm
                teamPlayers={leftTeamDropdownPlayers}
                onAddPlayer={(player) => handleAddPlayer('left', index, player)}
              />
            </div>
          ))}
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Away Team: {awayTeam}</h2>
          {positions.map((position, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold">{position}</h3>
              <ul>
                {rightTeamPlayers[index].map((player, playerIndex) => (
                  <Player
                    key={playerIndex}
                    player={player}
                    onDelete={() => handleDeletePlayer('right', index, playerIndex)}
                  />
                ))}
              </ul>
              <AddPlayerForm
                teamPlayers={rightTeamDropdownPlayers}
                onAddPlayer={(player) => handleAddPlayer('right', index, player)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddPlayerForm = ({ teamPlayers, onAddPlayer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPlayer) {
      onAddPlayer(selectedPlayer);
      setSelectedPlayer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center mt-2">
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
        className="select select-bordered mr-2"
      >
        <option value="" disabled>Select Player</option>
        {teamPlayers.map((player) => (
          <option key={player._id} value={player.name}>
            {player.name}
          </option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
};

export default MatchUpSelectionPage;
