import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importing team logos
import bostonCelticsLogo from "../assets/BostonCeltics.png";
import brooklynNetsLogo from "../assets/BrooklynNets.png";
import newYorkKnicksLogo from "../assets/NewYorkKnicks.png";
import philadelphia76ersLogo from "../assets/Philadelphia76ers.png";
import torontoRaptorsLogo from "../assets/TorontoRaptors.png";
import chicagoBullsLogo from "../assets/ChicagoBulls.png";
import clevelandCavaliersLogo from "../assets/ClevelandCavaliers.png";
import detroitPistonsLogo from "../assets/DetroitPistons.png";
import indianaPacersLogo from "../assets/IndianaPacers.png";
import milwaukeeBucksLogo from "../assets/MilwaukeeBucks.png";
import atlantaHawksLogo from "../assets/AtlantaHawks.png";
import charlotteHornetsLogo from "../assets/CharlotteHornets.png";
import miamiHeatLogo from "../assets/MiamiHeat.png";
import orlandoMagicLogo from "../assets/OrlandoMagic.png";
import washingtonWizardsLogo from "../assets/WashingtonWizards.png";
import denverNuggetsLogo from "../assets/DenverNuggets.png";
import minnesotaTimberwolvesLogo from "../assets/MinnesotaTimberwolves.png";
import oklahomaCityThunderLogo from "../assets/OklahomaCityThunder.png";
import portlandTrailBlazersLogo from "../assets/PortlandTrailBlazers.png";
import utahJazzLogo from "../assets/UtahJazz.png";
import goldenStateWarriorsLogo from "../assets/GoldenStateWarriors.png";
import losAngelesClippersLogo from "../assets/LAClippers.png";
import losAngelesLakersLogo from "../assets/LALakers.png";
import phoenixSunsLogo from "../assets/PhoenixSuns.png";
import sacramentoKingsLogo from "../assets/SacramentoKings.png";
import dallasMavericksLogo from "../assets/DallasMavericks.png";
import houstonRocketsLogo from "../assets/HoustonRockets.png";
import memphisGrizzliesLogo from "../assets/MemphisGrizzlies.png";
import newOrleansPelicansLogo from "../assets/NewOrleansPelicans.png";
import sanAntonioSpursLogo from "../assets/SanAntonioSpurs.png";

// Team logos mapping
const teamLogos = {
  "Boston Celtics": bostonCelticsLogo,
  "Brooklyn Nets": brooklynNetsLogo,
  "New York Knicks": newYorkKnicksLogo,
  "Philadelphia 76ers": philadelphia76ersLogo,
  "Toronto Raptors": torontoRaptorsLogo,
  "Chicago Bulls": chicagoBullsLogo,
  "Cleveland Cavaliers": clevelandCavaliersLogo,
  "Detroit Pistons": detroitPistonsLogo,
  "Indiana Pacers": indianaPacersLogo,
  "Milwaukee Bucks": milwaukeeBucksLogo,
  "Atlanta Hawks": atlantaHawksLogo,
  "Charlotte Hornets": charlotteHornetsLogo,
  "Miami Heat": miamiHeatLogo,
  "Orlando Magic": orlandoMagicLogo,
  "Washington Wizards": washingtonWizardsLogo,
  "Denver Nuggets": denverNuggetsLogo,
  "Minnesota Timberwolves": minnesotaTimberwolvesLogo,
  "Oklahoma City Thunder": oklahomaCityThunderLogo,
  "Portland Trail Blazers": portlandTrailBlazersLogo,
  "Utah Jazz": utahJazzLogo,
  "Golden State Warriors": goldenStateWarriorsLogo,
  "Los Angeles Clippers": losAngelesClippersLogo,
  "Los Angeles Lakers": losAngelesLakersLogo,
  "Phoenix Suns": phoenixSunsLogo,
  "Sacramento Kings": sacramentoKingsLogo,
  "Dallas Mavericks": dallasMavericksLogo,
  "Houston Rockets": houstonRocketsLogo,
  "Memphis Grizzlies": memphisGrizzliesLogo,
  "New Orleans Pelicans": newOrleansPelicansLogo,
  "San Antonio Spurs": sanAntonioSpursLogo,
};

const TeamSelectionPage = () => {
  const navigate = useNavigate();

  // Retrieve the team names from localStorage or use fallback values
  const homeTeam = localStorage.getItem('homeTeam') || "SELECT TEAM";
  const awayTeam = localStorage.getItem('awayTeam') || "SELECT TEAM";

  const [selectedHomeTeam, setSelectedHomeTeam] = useState(homeTeam);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(awayTeam);
  const [teamsByDivision, setTeamsByDivision] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const homeTeamDetailsRef = useRef(null);
  const awayTeamDetailsRef = useRef(null);

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
    if (selectedHomeTeam === "SELECT TEAM" || selectedAwayTeam === "SELECT TEAM") {
      alert("Please select a home team and away team before proceeding.");
    } else {
      localStorage.setItem('homeTeam', selectedHomeTeam);
      localStorage.setItem('awayTeam', selectedAwayTeam);
      navigate("/injury", {
        state: {
          homeTeam: selectedHomeTeam,
          awayTeam: selectedAwayTeam,
        },
      });
    }
  };

  const handleHomeTeamSelect = (team) => {
    setSelectedHomeTeam(team);
    localStorage.removeItem('homeTeamMatchup');
    if (homeTeamDetailsRef.current) {
      homeTeamDetailsRef.current.open = false;
    }
  };

  const handleAwayTeamSelect = (team) => {
    setSelectedAwayTeam(team);
    localStorage.removeItem('awayTeamMatchup');
    if (awayTeamDetailsRef.current) {
      awayTeamDetailsRef.current.open = false;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {/* Main content */}
      <div className="relative flex-grow" style={{ paddingBottom: "200px" }}>
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
            {/* Loop through the divisions and teams */}
            {Object.keys(teamsByDivision).map((division) => (
              <React.Fragment key={division}>
                <li className="menu-title">
                  <span>{division} Division</span>
                </li>
                {teamsByDivision[division].map((team) => (
                  <li key={team._id}>
                    <button onClick={() => handleHomeTeamSelect(team.name)} disabled={team.name === selectedAwayTeam}>{team.name}</button>
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
            {Object.keys(teamsByDivision).map((division) => (
              <React.Fragment key={division}>
                <li className="menu-title">
                  <span>{division} Division</span>
                </li>
                {teamsByDivision[division].map((team) => (
                  <li key={team._id}>
                    <button onClick={() => handleAwayTeamSelect(team.name)} disabled={team.name === selectedHomeTeam}>{team.name}</button>
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