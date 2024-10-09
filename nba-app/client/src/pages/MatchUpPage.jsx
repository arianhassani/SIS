import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Player from '../components/MatchUpPlayer';

const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

const MatchUpSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leftValue, rightValue } = location.state || {};
  const [leftTeamPlayers, setLeftTeamPlayers] = useState(positions.map(() => []));
  const [rightTeamPlayers, setRightTeamPlayers] = useState(positions.map(() => []));

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

  const handleDeletePlayer = (team, positionIndex, playerIndex) => {
    if (team === 'left') {
      const updatedPlayers = [...leftTeamPlayers];
      updatedPlayers[positionIndex].splice(playerIndex, 1);
      setLeftTeamPlayers(updatedPlayers);
    } else {
      const updatedPlayers = [...rightTeamPlayers];
      updatedPlayers[positionIndex].splice(playerIndex, 1);
      setRightTeamPlayers(updatedPlayers);
    }
  };

  const handleBack = () => {
    navigate('/', { state: { leftValue, rightValue } });
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold">Match Up Selection</h1>
      </div>
      <div className="flex justify-between w-full max-w-4xl mx-auto">
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Home Team: {leftValue}</h2>
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
              <AddPlayerForm onAddPlayer={(player) => handleAddPlayer('left', index, player)} />
            </div>
          ))}
        </div>
        <div className="w-1/2 p-4">
          <h2 className="text-2xl font-bold mb-4">Away Team: {rightValue}</h2>
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
              <AddPlayerForm onAddPlayer={(player) => handleAddPlayer('right', index, player)} />
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-secondary mt-8" onClick={handleBack}>
        Back
      </button>
    </div>
  );
};

const AddPlayerForm = ({ onAddPlayer }) => {
  const [player, setPlayer] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (player.trim()) {
      onAddPlayer(player);
      setPlayer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center mt-2">
      <input
        type="text"
        placeholder="Add Player"
        value={player}
        onChange={(e) => setPlayer(e.target.value)}
        className="input input-bordered mr-2"
      />
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
};

export default MatchUpSelectionPage;
