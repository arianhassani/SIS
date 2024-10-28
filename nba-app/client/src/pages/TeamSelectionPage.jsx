import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import teamLogos from '../components/teamLogos';

const TeamSelectionPage = () => {
  const navigate = useNavigate();

  // Retrieve the team names from session storage or use fallback values
  const homeTeam = sessionStorage.getItem('homeTeam') || 'SELECT TEAM';
  const awayTeam = sessionStorage.getItem('awayTeam') || 'SELECT TEAM';

  const [selectedHomeTeam, setSelectedHomeTeam] = useState(homeTeam);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(awayTeam);
  const [teamsByDivision, setTeamsByDivision] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const homeTeamDetailsRef = useRef(null);
  const awayTeamDetailsRef = useRef(null);

  const placeholder = 'https://placehold.co/400';

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/teams`);
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
        console.error('Error fetching teams:', error);
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleNextClick = () => {
    if (
      selectedHomeTeam === 'SELECT TEAM' ||
      selectedAwayTeam === 'SELECT TEAM'
    ) {
      alert('Please select a home team and away team before proceeding.');
    } else {
      const theHomeTeam = Object.values(teamsByDivision).flat().find(
        team => team.name === selectedHomeTeam
      );
      const theAwayTeam = Object.values(teamsByDivision).flat().find(
        team => team.name === selectedAwayTeam
      );
      sessionStorage.setItem('homeTeam', selectedHomeTeam);
      sessionStorage.setItem('awayTeam', selectedAwayTeam);
      // Set team nbaIDs into session storage
      sessionStorage.setItem('homeTeamNBAID', theHomeTeam.nbaID);
      sessionStorage.setItem('awayTeamNBAID', theAwayTeam.nbaID);


      navigate('/injury-page', {
        state: {
          homeTeam: selectedHomeTeam,
          awayTeam: selectedAwayTeam,
        },
      });
    }
  };

  const handleHomeTeamSelect = (team) => {
    setSelectedHomeTeam(team);
    sessionStorage.removeItem('homeTeamMatchup');
    if (homeTeamDetailsRef.current) {
      homeTeamDetailsRef.current.open = false;
    }
  };

  const handleAwayTeamSelect = (team) => {
    setSelectedAwayTeam(team);
    sessionStorage.removeItem('awayTeamMatchup');
    if (awayTeamDetailsRef.current) {
      awayTeamDetailsRef.current.open = false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="skeleton w-full h-full"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {/* Main content */}
      <div className="relative flex-grow" style={{ paddingBottom: '200px' }}>
        <label className="text-5xl font-bold absolute top-[calc(40%-260px)] left-1/2 transform -translate-x-1/2 text-center">
          Choose Your Teams
        </label>

        {/* "Next" Button */}
        <button
          className="btn absolute top-[calc(50%+15px)] left-1/2 transform -translate-x-1/2 btn-primary btn-outline"
          onClick={handleNextClick}
        >
          Next
        </button>

        {/* Home Team Selection */}
        <label className="absolute top-[calc(45%-200px)] left-[calc(50%-382px)] transform -translate-x-1/2 text-center">
          HOME TEAM
        </label>

        <details
          ref={homeTeamDetailsRef}
          className="dropdown absolute top-[calc(45%-122px)] transform -translate-x-1/2 -translate-y-1/2 z-30"
          style={{ left: 'calc(50% - 382px)', width: '17rem' }}
        >
          <summary
            className="btn m-1 text-center relative"
            style={{ width: '17rem' }}
          >
            {selectedHomeTeam}
          </summary>
          <ul
            className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center"
            style={{ width: '17rem', maxHeight: '400px', overflowY: 'auto' }}
          >
            {/* Loop through the divisions and teams */}
            {Object.keys(teamsByDivision).map((division) => (
              <React.Fragment key={division}>
                <li className="menu-title">
                  <span>{division} Division</span>
                </li>
                {teamsByDivision[division].map((team) => (
                  <li key={team._id}>
                    <button
                      onClick={() => handleHomeTeamSelect(team.name)}
                      disabled={team.name === selectedAwayTeam}
                    >
                      {team.name}
                    </button>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </details>

        {/* Display Home Team Logo */}
        {selectedHomeTeam !== 'SELECT TEAM' && (
          <img
            src={teamLogos[selectedHomeTeam] || placeholder}
            alt={selectedHomeTeam}
            className="absolute z-10"
            style={{
              top: 'calc(45% - 60px)',
              left: 'calc(50% - 382px)',
              transform: 'translateX(-50%)',
              width: '350px',
              height: '350px',
            }}
          />
        )}

        {/* Away Team Selection */}
        <label className="absolute top-[calc(45%-200px)] left-[calc(50%+382px)] transform -translate-x-1/2 text-center">
          AWAY TEAM
        </label>

        <details
          ref={awayTeamDetailsRef}
          className="dropdown absolute top-[calc(45%-122px)] transform -translate-x-1/2 -translate-y-1/2 z-30"
          style={{ left: 'calc(50% + 382px)', width: '17rem' }}
        >
          <summary
            className="btn m-1 text-center relative"
            style={{ width: '17rem' }}
          >
            {selectedAwayTeam}
          </summary>
          <ul
            className="dropdown-content menu menu-vertical bg-base-100 rounded-box z-40 p-2 shadow text-center"
            style={{ width: '17rem', maxHeight: '400px', overflowY: 'auto' }}
          >
            {Object.keys(teamsByDivision).map((division) => (
              <React.Fragment key={division}>
                <li className="menu-title">
                  <span>{division} Division</span>
                </li>
                {teamsByDivision[division].map((team) => (
                  <li key={team._id}>
                    <button
                      onClick={() => handleAwayTeamSelect(team.name)}
                      disabled={team.name === selectedHomeTeam}
                    >
                      {team.name}
                    </button>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </details>

        {/* Display Away Team Logo */}
        {selectedAwayTeam !== 'SELECT TEAM' && (
          <img
            src={teamLogos[selectedAwayTeam] || placeholder}
            alt={selectedAwayTeam}
            className="absolute z-10"
            style={{
              top: 'calc(45% - 60px)',
              left: 'calc(50% + 382px)',
              transform: 'translateX(-50%)',
              width: '350px',
              height: '350px',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TeamSelectionPage;
