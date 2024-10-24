import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import teamLogos from "../assets/teamLogos"; // Import the logos object

const TeamSelectionPage = () => {
  const [selectedSeason, setSelectedSeason] = useState("SELECT SEASON");
  const [selectedHomeTeam, setSelectedHomeTeam] = useState("SELECT TEAM");
  const [selectedAwayTeam, setSelectedAwayTeam] = useState("SELECT TEAM");
  const [teamsByDivision, setTeamsByDivision] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const homeTeamDetailsRef = useRef(null);
  const awayTeamDetailsRef = useRef(null);
  const seasonDetailsRef = useRef(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch('http://localhost:3000/teams');
        const data = await response.json();

        const teamsByDivision = data.reduce((divisions, team) => {
          if (!divisions[team.division]) {
            divisions[team.division] = [];
          }
          divisions[team.division].push(team);
          return divisions;
        }, {});

        setTeamsByDivision(teamsByDivision);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleNextClick = () => {
    if (selectedSeason === "SELECT SEASON" || selectedHomeTeam === "SELECT TEAM" || selectedAwayTeam === "SELECT TEAM") {
      alert("Please select a season, home team, and away team before proceeding.");
    } else {
      navigate("/injury", {
        state: {
          season: selectedSeason,
          homeTeam: selectedHomeTeam,
          awayTeam: selectedAwayTeam,
        },
      });
    }
  };

  const handleHomeTeamSelect = (team) => {
    setSelectedHomeTeam(team);
    if (homeTeamDetailsRef.current) {
      homeTeamDetailsRef.current.open = false;
    }
  };

  const handleAwayTeamSelect = (team) => {
    setSelectedAwayTeam(team);
    if (awayTeamDetailsRef.current) {
      awayTeamDetailsRef.current.open = false;
    }
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    if (seasonDetailsRef.current) {
      seasonDetailsRef.current.open = false;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      <div className="relative flex-grow" style={{ paddingBottom: "200px" }}>
        {/* Dropdown 1: SELECT SEASON */}
        <details
          ref={seasonDetailsRef}
          className="dropdown absolute top-[calc(50%-40px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          style={{ width: "17rem" }}
        >
          <summary className="btn m-1 text-center relative" style={{ width: "17rem" }}>
            {selectedSeason}
          </summary>
          <ul className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center" style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}>
            <li>
              <a onClick={() => handleSeasonSelect("2023-2024")}>2023-2024</a>
            </li>
            <li>
              <a onClick={() => handleSeasonSelect("2024-2025")}>2024-2025</a>
            </li>
          </ul>
        </details>

        <label className="absolute top-[calc(45%-260px)] left-1/2 transform -translate-x-1/2 text-center">
          Choose Your Teams
        </label>

        {/* "Next" Button */}
        <button className="btn absolute top-[calc(50%+15px)] left-1/2 transform -translate-x-1/2" onClick={handleNextClick}>
          Next
        </button>

        {/* Home Team Selection */}
        <label className="absolute top-[calc(45%-200px)] left-[calc(50%-382px)] transform -translate-x-1/2 text-center">
          HOME TEAM
        </label>

        <details ref={homeTeamDetailsRef} className="dropdown absolute top-[calc(45%-122px)] transform -translate-x-1/2 -translate-y-1/2 z-30" style={{ left: "calc(50% - 382px)", width: "17rem" }}>
          <summary className="btn m-1 text-center relative" style={{ width: "17rem" }}>
            {selectedHomeTeam}
          </summary>
          <ul className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center" style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}>
            {Object.keys(teamsByDivision).map((division) => (
              <React.Fragment key={division}>
                <li className="menu-title">
                  <span>{division} Division</span>
                </li>
                {teamsByDivision[division].map((team) => (
                  <li key={team._id}>
                    <a onClick={() => handleHomeTeamSelect(team.name)}>{team.name}</a>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </details>

        {/* Display Home Team Logo */}
        {selectedHomeTeam !== "SELECT TEAM" && (
          <img
            src={teamLogos[selectedHomeTeam]}
            alt={selectedHomeTeam}
            className="absolute z-10"
            style={{
              top: "calc(45% - 60px)",
              left: "calc(50% - 382px)",
              transform: "translateX(-50%)",
              width: "350px",
              height: "350px",
            }}
          />
        )}

        {/* Away Team Selection */}
        <label className="absolute top-[calc(45%-200px)] left-[calc(50%+382px)] transform -translate-x-1/2 text-center">
          AWAY TEAM
        </label>

        <details ref={awayTeamDetailsRef} className="dropdown absolute top-[calc(45%-122px)] transform -translate-x-1/2 -translate-y-1/2 z-30" style={{ left: "calc(50% + 382px)", width: "17rem" }}>
          <summary className="btn m-1 text-center relative" style={{ width: "17rem" }}>
            {selectedAwayTeam}
          </summary>
          <ul className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center" style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}>
            {Object.keys(teamsByDivision).map((division) => (
              <React.Fragment key={division}>
                <li className="menu-title">
                  <span>{division} Division</span>
                </li>
                {teamsByDivision[division].map((team) => (
                  <li key={team._id}>
                    <a onClick={() => handleAwayTeamSelect(team.name)}>{team.name}</a>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </details>

        {/* Display Away Team Logo */}
        {selectedAwayTeam !== "SELECT TEAM" && (
          <img
            src={teamLogos[selectedAwayTeam]}
            alt={selectedAwayTeam}
            className="absolute z-10"
            style={{
              top: "calc(45% - 60px)",
              left: "calc(50% + 382px)",
              transform: "translateX(-50%)",
              width: "350px",
              height: "350px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TeamSelectionPage;
