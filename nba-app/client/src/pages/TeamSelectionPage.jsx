import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Import team logos (adjusted paths)
import bostonCelticsLogo from "../assets/celtics.png";
import dallasMavericksLogo from "../assets/dallas-mavericks-logo-1.png";
import sixersLogo from "../assets/76ers.png";
// ... import logos for all NBA teams

// Team logos mapping
const teamLogos = {
  "Boston Celtics": bostonCelticsLogo,
  "Dallas Mavericks": dallasMavericksLogo,
  "Philadelphia 76ers": sixersLogo,
  // ... add mappings for all NBA teams
};

// NBA Teams Data Organized by Conference and Division
const nbaTeams = [
  {
    conference: "Eastern Conference",
    divisions: [
      {
        division: "Atlantic Division",
        teams: [
          "Boston Celtics",
          "Brooklyn Nets",
          "New York Knicks",
          "Philadelphia 76ers",
          "Toronto Raptors",
        ],
      },
      {
        division: "Central Division",
        teams: [
          "Chicago Bulls",
          "Cleveland Cavaliers",
          "Detroit Pistons",
          "Indiana Pacers",
          "Milwaukee Bucks",
        ],
      },
      {
        division: "Southeast Division",
        teams: [
          "Atlanta Hawks",
          "Charlotte Hornets",
          "Miami Heat",
          "Orlando Magic",
          "Washington Wizards",
        ],
      },
    ],
  },
  {
    conference: "Western Conference",
    divisions: [
      {
        division: "Northwest Division",
        teams: [
          "Denver Nuggets",
          "Minnesota Timberwolves",
          "Oklahoma City Thunder",
          "Portland Trail Blazers",
          "Utah Jazz",
        ],
      },
      {
        division: "Pacific Division",
        teams: [
          "Golden State Warriors",
          "Los Angeles Clippers",
          "Los Angeles Lakers",
          "Phoenix Suns",
          "Sacramento Kings",
        ],
      },
      {
        division: "Southwest Division",
        teams: [
          "Dallas Mavericks",
          "Houston Rockets",
          "Memphis Grizzlies",
          "New Orleans Pelicans",
          "San Antonio Spurs",
        ],
      },
    ],
  },
];

const TeamSelectionPage = () => {
  // State to store selected values
  const [selectedSeason, setSelectedSeason] = useState("SELECT SEASON");
  const [selectedHomeTeam, setSelectedHomeTeam] = useState("SELECT TEAM");
  const [selectedAwayTeam, setSelectedAwayTeam] = useState("SELECT TEAM");

  const navigate = useNavigate(); // Initialize useNavigate

  // Refs for the dropdowns
  const homeTeamDetailsRef = useRef(null);
  const awayTeamDetailsRef = useRef(null);
  const seasonDetailsRef = useRef(null);

  const handleNextClick = () => {
    // Ensure a valid season, home team, and away team are selected
    if (selectedSeason === "SELECT SEASON" || selectedHomeTeam === "SELECT TEAM" || selectedAwayTeam === "SELECT TEAM") {
      alert("Please select a season, home team, and away team before proceeding.");
    } else {
      // Navigate to InjuryPage and pass selectedSeason, selectedHomeTeam, and selectedAwayTeam as state
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

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {/* Main content */}
      <div className="relative flex-grow" style={{ paddingBottom: "200px" }}>
        {/* Dropdown 1: SELECT SEASON */}
        <details
          ref={seasonDetailsRef}
          className="dropdown absolute top-[calc(50%-40px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          style={{ width: "17rem" }}
        >
          <summary className="btn m-1 text-center relative" style={{ width: "17rem" }}>
            {selectedSeason}
            <svg
              className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ pointerEvents: "none" }}
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <ul
            className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center"
            style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}
          >
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
            <svg
              className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ pointerEvents: "none" }}
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <ul className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center" style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}>
            {nbaTeams.map((conference) => (
              <React.Fragment key={conference.conference}>
                <li className="menu-title">
                  <span>{conference.conference}</span>
                </li>
                {conference.divisions.map((division) => (
                  <React.Fragment key={division.division}>
                    <li className="menu-title">
                      <span>{division.division}</span>
                    </li>
                    {division.teams.map((team) => (
                      <li key={team}>
                        <a onClick={() => handleHomeTeamSelect(team)}>{team}</a>
                      </li>
                    ))}
                  </React.Fragment>
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
            className="absolute top-[calc(45%-56px)] z-10"
            style={{
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
            <svg
              className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              style={{ pointerEvents: "none" }}
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <ul className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center" style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}>
            {nbaTeams.map((conference) => (
              <React.Fragment key={conference.conference}>
                <li className="menu-title">
                  <span>{conference.conference}</span>
                </li>
                {conference.divisions.map((division) => (
                  <React.Fragment key={division.division}>
                    <li className="menu-title">
                      <span>{division.division}</span>
                    </li>
                    {division.teams.map((team) => (
                      <li key={team}>
                        <a onClick={() => handleAwayTeamSelect(team)}>{team}</a>
                      </li>
                    ))}
                  </React.Fragment>
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
            className="absolute top-[calc(45%-56px)] z-10"
            style={{
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
