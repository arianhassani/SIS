import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const InjuryPage = () => {
  const navigate = useNavigate();

  const [homeTeam, setHomeTeam] = useState(localStorage.getItem("homeTeam") || "No home team selected");
  const [awayTeam, setAwayTeam] = useState(localStorage.getItem("awayTeam") || "No away team selected");

  const [showModal, setShowModal] = useState(false);
  const [homePlayers, setHomePlayers] = useState(JSON.parse(sessionStorage.getItem(`${homeTeam}HomePlayers`)) || []);
  const [awayPlayers, setAwayPlayers] = useState(JSON.parse(sessionStorage.getItem(`${awayTeam}AwayPlayers`)) || []);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState("");
  const [description, setDescription] = useState("");
  const [teamType, setTeamType] = useState("");
  const [availablePlayers, setAvailablePlayers] = useState([]);

  const fetchUpdatedHomePlayers = useCallback(async (homeTeam) => {
    try {
      const response = await fetch(`http://localhost:3000/${homeTeam}/updatedPlayers`);
      const data = await response.json();
      sessionStorage.setItem(`${homeTeam}HomePlayers`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error fetching updated home players:", error);
      return [];
    }
  }, []);

  const fetchUpdatedAwayPlayers = useCallback(async (awayTeam) => {
    try {
      const response = await fetch(`http://localhost:3000/${awayTeam}/updatedPlayers`);
      const data = await response.json();
      sessionStorage.setItem(`${awayTeam}AwayPlayers`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Error fetching updated away players:", error);
      return [];
    }
  }, []);

  const initializePlayers = useCallback(async (homeTeam, awayTeam) => {
    if (!sessionStorage.getItem(`${homeTeam}HomePlayers`)) {
      const homePlayers = await fetchUpdatedHomePlayers(homeTeam);
      setHomePlayers(homePlayers);
    } else {
      setHomePlayers(JSON.parse(sessionStorage.getItem(`${homeTeam}HomePlayers`)));
    }

    if (!sessionStorage.getItem(`${awayTeam}AwayPlayers`)) {
      const awayPlayers = await fetchUpdatedAwayPlayers(awayTeam);
      setAwayPlayers(awayPlayers);
    } else {
      setAwayPlayers(JSON.parse(sessionStorage.getItem(`${awayTeam}AwayPlayers`)));
    }

    setLoading(false);
  }, [fetchUpdatedHomePlayers, fetchUpdatedAwayPlayers]);

  useEffect(() => {
    const fetchData = async () => {
      await initializePlayers(homeTeam, awayTeam);
    };

    fetchData();
  }, [homeTeam, awayTeam, initializePlayers]);

  useEffect(() => {
    const availablePlayers =
      teamType === "home"
        ? homePlayers.filter(player => !player.isInjured)
        : awayPlayers.filter(player => !player.isInjured);

    setAvailablePlayers(availablePlayers);
  }, [teamType, homePlayers, awayPlayers]);

  useEffect(() => {
    const handleStorageChange = () => {
      setHomeTeam(localStorage.getItem("homeTeam") || "No home team selected");
      setAwayTeam(localStorage.getItem("awayTeam") || "No away team selected");
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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

          setShowModal(false);
          setPlayer('');
          setDescription('');
          setTeamType('');

          // Update the local state and session storage after adding injury
          const updatedPlayers = selectedPlayers.map(p => 
            p._id === selectedPlayer._id ? { ...p, isInjured: true, injuryDetails: description } : p
          );

          if (teamType === 'home') {
            setHomePlayers(updatedPlayers);
            sessionStorage.setItem(`${homeTeam}HomePlayers`, JSON.stringify(updatedPlayers));
          } else {
            setAwayPlayers(updatedPlayers);
            sessionStorage.setItem(`${awayTeam}AwayPlayers`, JSON.stringify(updatedPlayers));
          }
        } catch (error) {
          console.error('Error updating player injury status:', error);
        }
      }
    }
  };

  const handleResolveInjury = async (playerId) => {
    try {
      console.log(playerId);
      await fetch(`http://localhost:3000/players/${playerId}/resolve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Update the local state and session storage after resolving injury
      const homePlayers = JSON.parse(sessionStorage.getItem(`${homeTeam}HomePlayers`)) || [];
      const awayPlayers = JSON.parse(sessionStorage.getItem(`${awayTeam}AwayPlayers`)) || [];

      const updatePlayerInjuryStatus = (players) => {
        return players.map(player => {
          if (player._id === playerId) {
            return { ...player, isInjured: false, injuryDetails: '' };
          }
          return player;
        });
      };

      const updatedHomePlayers = updatePlayerInjuryStatus(homePlayers);
      const updatedAwayPlayers = updatePlayerInjuryStatus(awayPlayers);

      sessionStorage.setItem(`${homeTeam}HomePlayers`, JSON.stringify(updatedHomePlayers));
      sessionStorage.setItem(`${awayTeam}AwayPlayers`, JSON.stringify(updatedAwayPlayers));

      setHomePlayers(updatedHomePlayers);
      setAwayPlayers(updatedAwayPlayers);
      console.log(updatedAwayPlayers);
    } catch (error) {
      console.error('Error resolving player injury status:', error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleNext = () => {
    navigate("/match-up");
  };

  const placeholderImage = "https://via.placeholder.com/150";

  if (loading) {
    return <div>Loading...</div>;
  }

  const homeInjuredPlayers = homePlayers.filter(player => player.isInjured);
  const awayInjuredPlayers = awayPlayers.filter(player => player.isInjured);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col w-full">
      {/* Roster Selection Heading */}
      <div className="text-center" style={{ marginTop: "2cm" }}>
        <h1 className="text-xl">Roster Selection</h1>
      </div>

      {/* Live Roster Updates Heading */}
      <div className="text-center my-8" style={{ marginTop: "1.5cm" }}>
        <h1 className="text-xl">Live Roster Updates</h1>
      </div>

      {/* Rectangle with "Injury Reports" text inside and Add button */}
      <div
        className="w-full bg-gray-700 flex justify-between items-center"
        style={{
          height: "1.7cm",
          marginTop: "0.5cm",
          paddingLeft: "1.3cm",
          paddingRight: "1.3cm",
        }}
      >
        <span className="text-white text-lg">Injury Reports</span>
        <button
          className="bg-gray-800 text-white py-1 px-3 rounded"
          onClick={() => {
            setTeamType(""); // Reset team type when opening the modal
            setShowModal(true); // Open the modal when clicked
          }}
        >
          + Add Injury
        </button>
      </div>

      {/* Home Team Injuries */}
      <div className="mt-4" style={{ marginTop: "1cm" }}>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Home Team: {homeTeam}
        </h2>
        {homeInjuredPlayers.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {homeInjuredPlayers.map((injury, index) => (
              <div key={index} className="p-4 rounded">
                {/* Player Photo */}
                <img
                  src={placeholderImage}
                  alt={injury.name}
                  className="w-32 h-32 mx-auto mb-4 rounded-full"
                />
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
      <div className="mt-12" style={{ marginTop: "3cm" }}>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Away Team: {awayTeam}
        </h2>
        {awayInjuredPlayers.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {awayInjuredPlayers.map((injury, index) => (
              <div key={index} className="p-4 rounded">
                {/* Player Photo */}
                <img
                  src={placeholderImage}
                  alt={injury.name}
                  className="w-32 h-32 mx-auto mb-4 rounded-full"
                />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl mb-4">Add Injury</h2>
            <div className="mb-4">
              <select
                value={teamType}
                onChange={(e) => setTeamType(e.target.value)}
                className="select select-bordered w-full mb-4"
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
                disabled={!teamType}
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
        <button className="btn btn-secondary" onClick={handleBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default InjuryPage;