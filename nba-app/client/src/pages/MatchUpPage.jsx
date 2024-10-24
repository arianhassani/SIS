import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Player from '../components/MatchUpPlayer';

const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

const MatchUpSelectionPage = () => {
  const navigate = useNavigate();

  const [leftTeamPlayers, setLeftTeamPlayers] = useState(() => {
    const savedLeftTeamPlayers = localStorage.getItem('leftTeamPlayers');
    return savedLeftTeamPlayers ? JSON.parse(savedLeftTeamPlayers) : positions.map(() => []);
  });
  const [rightTeamPlayers, setRightTeamPlayers] = useState(() => {
    const savedRightTeamPlayers = localStorage.getItem('rightTeamPlayers');
    return savedRightTeamPlayers ? JSON.parse(savedRightTeamPlayers) : positions.map(() => []);
  });
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  // Retrieve the team names from localStorage or use fallback values
  const homeTeam = localStorage.getItem('homeTeam') || "No home team selected";
  const awayTeam = localStorage.getItem('awayTeam') || "No away team selected";

  useEffect(() => {
    const fetchPlayers = async (teamName, setPlayers) => {
      try {
        const response = await fetch(`http://localhost:3000/${teamName}/players`);
        const data = await response.json();
        setPlayers(data.players || []);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    if (homeTeam !== "No home team selected") {
      fetchPlayers(homeTeam, setHomePlayers);
    }

    if (awayTeam !== "No away team selected") {
      fetchPlayers(awayTeam, setAwayPlayers);
    }
  }, [homeTeam, awayTeam]);

  useEffect(() => {
    localStorage.setItem('leftTeamPlayers', JSON.stringify(leftTeamPlayers));
  }, [leftTeamPlayers]);

  useEffect(() => {
    localStorage.setItem('rightTeamPlayers', JSON.stringify(rightTeamPlayers));
  }, [rightTeamPlayers]);

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
    navigate('/injury');
  };

  const handleNextClick = () => {
    navigate("/prediction");
  };

  const getAvailablePlayers = (teamPlayers, allPlayers) => {
    const selectedPlayers = teamPlayers.flat();
    return allPlayers.filter(player => !selectedPlayers.some(selected => selected._id === player._id));
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
                    player={player.name}
                    onDelete={() => handleDeletePlayer('left', index, playerIndex)}
                  />
                ))}
              </ul>
              {leftTeamPlayers[index].length === 0 && (
                <AddPlayerForm 
                  onAddPlayer={(player) => handleAddPlayer('left', index, player)}
                  availablePlayers={getAvailablePlayers(leftTeamPlayers, homePlayers)}
                />
              )}
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
                    player={player.name}
                    onDelete={() => handleDeletePlayer('right', index, playerIndex)}
                  />
                ))}
              </ul>
              {rightTeamPlayers[index].length === 0 && (
                <AddPlayerForm 
                  onAddPlayer={(player) => handleAddPlayer('right', index, player)}
                  availablePlayers={getAvailablePlayers(rightTeamPlayers, awayPlayers)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-secondary mt-8" onClick={handleBack}>
          Back
        </button>
      </div>
      <div className="text-center">
        <button className="btn btn-secondary mt-8" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
};

const AddPlayerForm = ({ onAddPlayer, availablePlayers }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedPlayer) {
      const player = availablePlayers.find(p => p._id === selectedPlayer);
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
    <form onSubmit={handleSubmit} className="flex items-center mt-2">
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
        className="select select-bordered mr-2"
      >
        <option value="" disabled>Select Player</option>
        {availablePlayers.map((player) => (
          <option key={player._id} value={player._id}>{player.name}</option>
        ))}
      </select>
      <button type="submit" className="btn btn-primary">
        Add
      </button>
      {error && <p className="text-red-500 ml-2">{error}</p>}
    </form>
  );
};

export default MatchUpSelectionPage;