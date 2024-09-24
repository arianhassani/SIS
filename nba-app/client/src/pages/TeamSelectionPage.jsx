import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import team logos (adjusted paths)

import bostonCelticsLogo from "../assets/celtics.png";
import dallasMavericksLogo from "../assets/dallas-mavericks-logo-1.png";
import sixersLogo from "../assets/76ers.png";
// ... import logos for all teams

// Team logos mapping
const teamLogos = {

  "Boston Celtics": bostonCelticsLogo,
  "Dallas Mavericks": dallasMavericksLogo,
  "Philadelphia 76ers": sixersLogo
  // ... add mappings for all teams
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

  const handleNextClick = () => {
    // Navigate to InjuryPage
    navigate("/injury");
  };

  return (
    // Parent container with 'relative h-screen'
    <div className="relative h-screen">
      {/* Dropdown 1: SELECT SEASON */}
      <details
        className="dropdown absolute top-[calc(50%-76px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ width: "17rem" }}
      >
        <summary
          className="btn m-1 text-center"
          style={{ width: "17rem" }}
        >
          {selectedSeason}
        </summary>
        <ul
          className="dropdown-content menu menu-compact bg-base-100 rounded-box z-40 p-2 shadow"
          style={{ width: "17rem" }}
        >
          <li>
            <a onClick={() => setSelectedSeason("2023-2024")}>
              2023-2024
            </a>
          </li>
          <li>
            <a onClick={() => setSelectedSeason("2024-2025")}>
              2024-2025
            </a>
          </li>
        </ul>
      </details>

      <label className="absolute top-[calc(45%-300px)] left-1/2 transform -translate-x-1/2 text-center">
        TEAM SELECTION
      </label>

      {/* "Next" Button */}
      <button
        className="btn absolute top-[calc(50%+0px)] left-1/2 transform -translate-x-1/2"
        onClick={handleNextClick}
      >
        Next
      </button>

      {/* Home Team Selection */}
      <label className="absolute top-[calc(45%-220px)] left-[calc(50%-382px)] transform -translate-x-1/2 text-center">
        HOME TEAM
      </label>

      <details
        className="dropdown absolute top-[calc(45%-152px)] transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ left: "calc(50% - 382px)", width: "17rem" }}
      >
        <summary
          className="btn m-1 text-center"
          style={{ width: "17rem" }}
        >
          {selectedHomeTeam}
        </summary>
        <ul
          className="dropdown-content menu menu-compact bg-base-100 rounded-box z-40 p-2 shadow"
          style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}
        >
          {nbaTeams.map((conference) => (
            <React.Fragment key={conference.conference}>
              <li className="menu-title">
                <span>{conference.conference}</span>
              </li>
              {conference.divisions.map((division) => (
                <React.Fragment key={division.division}>
                  <li className="menu-title ml-4">
                    <span>{division.division}</span>
                  </li>
                  {division.teams.map((team) => (
                    <li key={team} className="ml-8">
                      <a onClick={() => setSelectedHomeTeam(team)}>
                        {team}
                      </a>
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
          className="absolute top-[calc(45%-76px)]"
          style={{
            left: "calc(50% - 382px)",
            transform: "translateX(-50%)",
            width: "350px",
            height: "350px",
            zIndex: 10,
          }}
        />
      )}

      {/* Away Team Selection */}
      <label className="absolute top-[calc(45%-220px)] left-[calc(50%+382px)] transform -translate-x-1/2 text-center">
        AWAY TEAM
      </label>

      <details
        className="dropdown absolute top-[calc(45%-152px)] transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ left: "calc(50% + 382px)", width: "17rem" }}
      >
        <summary
          className="btn m-1 text-center"
          style={{ width: "17rem" }}
        >
          {selectedAwayTeam}
        </summary>
        <ul
          className="dropdown-content menu menu-compact bg-base-100 rounded-box z-40 p-2 shadow"
          style={{ width: "17rem", maxHeight: "400px", overflowY: "auto" }}
        >
          {nbaTeams.map((conference) => (
            <React.Fragment key={conference.conference}>
              <li className="menu-title">
                <span>{conference.conference}</span>
              </li>
              {conference.divisions.map((division) => (
                <React.Fragment key={division.division}>
                  <li className="menu-title ml-4">
                    <span>{division.division}</span>
                  </li>
                  {division.teams.map((team) => (
                    <li key={team} className="ml-8">
                      <a onClick={() => setSelectedAwayTeam(team)}>
                        {team}
                      </a>
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
          className="absolute top-[calc(45%-76px)]"
          style={{
            left: "calc(50% + 382px)",
            transform: "translateX(-50%)",
            width: "350px",
            height: "350px",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

export default TeamSelectionPage;
