import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Player from '../components/Player';
import { addPlayerFormPropTypes } from '../components/propTypes';

const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

const MatchUpSelectionPage = () => {
  const navigate = useNavigate();

  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  // Retrieve the team names from localStorage or use fallback values
  const homeTeam = localStorage.getItem('homeTeam') || "No home team selected";
  const awayTeam = localStorage.getItem('awayTeam') || "No home team selected";

  const getMatchupFromLocalStorage = (team) => {
    const savedMatchup = localStorage.getItem(`${team}TeamMatchup`);
    return savedMatchup ? JSON.parse(savedMatchup) : positions.map(() => []);
  };

  const [homeTeamMatchup, setHomeTeamMatchup] = useState(getMatchupFromLocalStorage('home'));
  const [awayTeamMatchup, setAwayTeamMatchup] = useState(getMatchupFromLocalStorage('away'));

  useEffect(() => {
    const fetchPlayers = async (teamName, setPlayers) => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams/${teamName}/players`);
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

  const handleAddPlayer = (team, positionIndex, player) => {
    if (team === 'home') {
      const updatedPlayers = [...homeTeamMatchup];
      updatedPlayers[positionIndex].push(player);
      setHomeTeamMatchup(updatedPlayers);
      localStorage.setItem('homeTeamMatchup', JSON.stringify(updatedPlayers));
    } else {
      const updatedPlayers = [...awayTeamMatchup];
      updatedPlayers[positionIndex].push(player);
      setAwayTeamMatchup(updatedPlayers);
      localStorage.setItem('awayTeamMatchup', JSON.stringify(updatedPlayers));
    }
  };

  const handleDeletePlayer = (team, positionIndex, playerIndex) => {
    if (team === 'home') {
      const updatedPlayers = [...homeTeamMatchup];
      updatedPlayers[positionIndex].splice(playerIndex, 1);
      setHomeTeamMatchup(updatedPlayers);
      localStorage.setItem('homeTeamMatchup', JSON.stringify(updatedPlayers));
    } else {
      const updatedPlayers = [...awayTeamMatchup];
      updatedPlayers[positionIndex].splice(playerIndex, 1);
      setAwayTeamMatchup(updatedPlayers);
      localStorage.setItem('awayTeamMatchup', JSON.stringify(updatedPlayers));
    }
  };

  const handleBack = () => {
    navigate('/injury-page');
  };

  const handleNextClick = async () => {
    const homeTeamPlayerIds = homeTeamMatchup.flat().map(player => player._id);
    const awayTeamPlayerIds = awayTeamMatchup.flat().map(player => player._id);
  
    try {
      // Fetch top performer for the home team
      const homeResponse = await fetch('http://localhost:3000/api/predict/top-performer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerIds: homeTeamPlayerIds }),
      });
  
      const homeTopPerformer = await homeResponse.json();
  
      // Fetch top performer for the away team
      const awayResponse = await fetch('http://localhost:3000/api/predict/top-performer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerIds: awayTeamPlayerIds }),
      });
  
      const awayTopPerformer = await awayResponse.json();
  
      // Navigate to the prediction page with both top performers
      navigate("/prediction-page", { state: { homeTopPerformer, awayTopPerformer, homeTeamPlayerIds, awayTeamPlayerIds } });
    } catch (error) {
      console.error('Error fetching top performers:', error);
    }
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
                {homeTeamMatchup[index].map((player, playerIndex) => (
                  <Player
                    key={playerIndex}
                    player={player.name}
                    onDelete={() => handleDeletePlayer('home', index, playerIndex)}
                  />
                ))}
              </ul>
              {homeTeamMatchup[index].length === 0 && (
                <AddPlayerForm 
                  onAddPlayer={(player) => handleAddPlayer('home', index, player)}
                  availablePlayers={getAvailablePlayers(homeTeamMatchup, homePlayers)}
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
                {awayTeamMatchup[index].map((player, playerIndex) => (
                  <Player
                    key={playerIndex}
                    player={player.name}
                    onDelete={() => handleDeletePlayer('away', index, playerIndex)}
                  />
                ))}
              </ul>
              {awayTeamMatchup[index].length === 0 && (
                <AddPlayerForm 
                  onAddPlayer={(player) => handleAddPlayer('away', index, player)}
                  availablePlayers={getAvailablePlayers(awayTeamMatchup, awayPlayers)}
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

AddPlayerForm.propTypes = addPlayerFormPropTypes;

export default MatchUpSelectionPage;