import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InjuryPage = () => {
  const navigate = useNavigate();

  // Retrieve the team names from localStorage or use fallback values
  const homeTeam = localStorage.getItem('homeTeam') || "No home team selected";
  const awayTeam = localStorage.getItem('awayTeam') || "No away team selected";

  // State to track injuries and modal visibility
  const [injuries, setInjuries] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // State to track players
  const [homePlayers, setHomePlayers] = useState([]);
  const [awayPlayers, setAwayPlayers] = useState([]);

  // Form state for adding an injury
  const [player, setPlayer] = useState('');
  const [description, setDescription] = useState('');
  const [teamType, setTeamType] = useState(''); // Home or Away team

  // Fetch players for home and away teams
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const homeResponse = await fetch(`http://localhost:3000/${homeTeam}/players`);
        const homeData = await homeResponse.json();
        const awayResponse = await fetch(`http://localhost:3000/${awayTeam}/players`);
        const awayData = await awayResponse.json();

        setHomePlayers(homeData.players || []);
        setAwayPlayers(awayData.players || []);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, [homeTeam, awayTeam]);

  // Fetch injured players for home and away teams
  useEffect(() => {
    const fetchInjuredPlayers = async () => {
      try {
        const homeInjuredResponse = await fetch(`http://localhost:3000/${homeTeam}/injuredPlayers`);
        const homeInjuredData = await homeInjuredResponse.json();
        const awayInjuredResponse = await fetch(`http://localhost:3000/${awayTeam}/injuredPlayers`);
        const awayInjuredData = await awayInjuredResponse.json();

        setHomePlayers(prevPlayers => prevPlayers.map(player => ({
          ...player,
          isInjured: homeInjuredData.some(injuredPlayer => injuredPlayer._id === player._id)
        })));

        setAwayPlayers(prevPlayers => prevPlayers.map(player => ({
          ...player,
          isInjured: awayInjuredData.some(injuredPlayer => injuredPlayer._id === player._id)
        })));
      } catch (error) {
        console.error('Error fetching injured players:', error);
      }
    };

    fetchInjuredPlayers();
  }, [homeTeam, awayTeam]);

  // Filter injuries for home and away teams
  const homeInjuries = homePlayers.filter(player => player.isInjured);
  const awayInjuries = awayPlayers.filter(player => player.isInjured);

  // Function to add a new injury
  const handleAddInjury = async () => {
    if (player && description && teamType) {
      const selectedTeam = teamType === 'home' ? homeTeam : awayTeam;
      const selectedPlayers = teamType === 'home' ? homePlayers : awayPlayers;
      const selectedPlayer = selectedPlayers.find(p => p.name === player);

      if (selectedPlayer) {
        try {
          await fetch(`http://localhost:3000/players/${selectedPlayer._id}/injure`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              description,
            }),
          });

          setInjuries([...injuries, { team: selectedTeam, player, description, resolved: false }]);
          setShowModal(false); // Close the modal after adding the injury
          setPlayer(''); // Reset the form
          setDescription('');
          setTeamType('');

          // Refresh players to update injury status
          const homeResponse = await fetch(`http://localhost:3000/${homeTeam}/players`);
          const homeData = await homeResponse.json();
          const awayResponse = await fetch(`http://localhost:3000/${awayTeam}/players`);
          const awayData = await awayResponse.json();
          setHomePlayers(homeData.players || []);
          setAwayPlayers(awayData.players || []);

          // Log the injured players for both teams
          console.log('Home Team Injured Players:', homeData.players.filter(player => player.isInjured));
          console.log('Away Team Injured Players:', awayData.players.filter(player => player.isInjured));
        } catch (error) {
          console.error('Error updating player injury status:', error);
        }
      }
    }
  };

  // Function to mark an injury as resolved
  const handleResolveInjury = async (playerId) => {
    try {
      await fetch(`http://localhost:3000/players/${playerId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Refresh players to update injury status
      const homeResponse = await fetch(`http://localhost:3000/${homeTeam}/players`);
      const homeData = await homeResponse.json();
      const awayResponse = await fetch(`http://localhost:3000/${awayTeam}/players`);
      const awayData = await awayResponse.json();
      setHomePlayers(homeData.players || []);
      setAwayPlayers(awayData.players || []);

      // Log the injured players for both teams
      console.log('Home Team Injured Players:', homeData.players.filter(player => player.isInjured));
      console.log('Away Team Injured Players:', awayData.players.filter(player => player.isInjured));
    } catch (error) {
      console.error('Error resolving player injury status:', error);
    }
  };

  // Navigate back to the previous page
  const handleBack = () => {
    navigate('/');
  };

  const handleNext = () => {
    navigate("/match-up");
  };

  // Placeholder image URL (this could be replaced with real player images in the future)
  const placeholderImage = 'https://via.placeholder.com/150'; // Placeholder image URL

  // Filter non-injured players for the modal dropdown
  const availablePlayers = teamType === 'home'
    ? homePlayers.filter(player => !player.isInjured)
    : awayPlayers.filter(player => !player.isInjured);

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
          onClick={() => {
            setTeamType(''); // Reset team type when opening the modal
            setShowModal(true); // Open the modal when clicked
          }}
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
                <img src={placeholderImage} alt={injury.name} className="w-32 h-32 mx-auto mb-4 rounded-full" />
                {/* Player Name */}
                <h3 className="font-bold text-center">Player: {injury.name}</h3>
                {/* Description */}
                <p className="text-center mt-2">{injury.injuryDetails}</p>
                <button
                  className="btn btn-sm btn-success mt-2 mx-auto block"
                  onClick={() => handleResolveInjury(injury._id)}
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

      {/* Away Team Injuries */}
      <div className="mt-12" style={{ marginTop: '3cm' }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Away Team: {awayTeam}</h2>
        {awayInjuries.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {awayInjuries.map((injury, index) => (
              <div key={index} className="p-4 rounded">
                {/* Player Photo */}
                <img src={placeholderImage} alt={injury.name} className="w-32 h-32 mx-auto mb-4 rounded-full" />
                {/* Player Name */}
                <h3 className="font-bold text-center">Player: {injury.name}</h3>
                {/* Description */}
                <p className="text-center mt-2">{injury.injuryDetails}</p>
                <button
                  className="btn btn-sm btn-success mt-2 mx-auto block"
                  onClick={() => handleResolveInjury(injury._id)}
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
              <select
                value={player}
                onChange={(e) => setPlayer(e.target.value)}
                className="select select-bordered w-full mb-4"
                disabled={!teamType}
              >
                <option value="" disabled>Select Player</option>
                {availablePlayers.map((player) => (
                  <option key={player._id} value={player.name}>{player.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input input-bordered w-full mb-2"
                disabled={!teamType || !player}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="btn btn-primary mr-2"
                onClick={handleAddInjury}
                disabled={!teamType || !player || !description}
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

      {/* Buttons */}
      <div className="flex justify-between mt-8 mx-4">
        <button className="btn btn-secondary" onClick={handleBack}>Back</button>
        <button className="btn btn-primary" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default InjuryPage;