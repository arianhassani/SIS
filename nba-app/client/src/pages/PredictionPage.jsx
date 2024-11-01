import React, { useState, useEffect, useCallback } from 'react';
import { json, useLocation, useNavigate } from 'react-router-dom';
import teamLogos from '../components/teamLogos';
import TooltipIcon from '../components/TooltipIcon';
import placeholderImg from '../assets/placeholder.png';

const PredictionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedModel, setSelectedModel] = useState('');
  const [homeTopPerformerGraph, setHomeTopPerformerGraph] = useState('');
  const [awayTopPerformerGraph, setAwayTopPerformerGraph] = useState('');
  const [homeTeamPerformanceGraph, setHomeTeamPerformanceGraph] = useState('');
  const [awayTeamPerformanceGraph, setAwayTeamPerformanceGraph] = useState('');
  const [loadingScores, setLoadingScores] = useState(true);
  const [loadingHomeTopPerformer, setLoadingHomeTopPerformer] = useState(true);
  const [loadingAwayTopPerformer, setLoadingAwayTopPerformer] = useState(true);

  const [jsonHomeScore, setJsonHomeScore] = useState('');
  const [jsonAwayScore, setJsonAwayScore] = useState('');
  const [jsonHomeScorePB, setJsonHomeScorePB] = useState('');
  const [jsonAwayScorePB, setJsonAwayScorePB] = useState('');
  const [jsonHomeScoreRF, setJsonHomeScoreRF] = useState('');
  const [jsonAwayScoreRF, setJsonAwayScoreRF] = useState('');
  // Example scores for each model
  const modelScores = {
    'Model 1': { homeScore: jsonHomeScore, awayScore: jsonAwayScore },
    'Model 2': { homeScore: jsonHomeScorePB, awayScore: jsonAwayScorePB },
    'Model 3': { homeScore: jsonHomeScoreRF, awayScore: jsonAwayScoreRF },
  };

  // Retrieve prediction scores

  // Retrieve the team names from session storage or use fallback values
  const homeTeam =
    sessionStorage.getItem('homeTeam') || 'No home team selected';
  const awayTeam =
    sessionStorage.getItem('awayTeam') || 'No home team selected';

  const homeTeamID = sessionStorage.getItem('homeTeamNBAID');
  const awayTeamID = sessionStorage.getItem('awayTeamNBAID');
  // Parse the JSON string from session storage
  const homeTeamLineup = JSON.parse(sessionStorage.getItem('homeTeamMatchup'));
  const homeTeamNBAIds = homeTeamLineup.map(
    (playerArray) => playerArray[0].nbaID,
  );
  console.log(homeTeamNBAIds);
  const awayTeamLineup = JSON.parse(sessionStorage.getItem('awayTeamMatchup'));
  const awayTeamNBAIds = awayTeamLineup.map(
    (playerArray) => playerArray[0].nbaID,
  );
  console.log(awayTeamNBAIds);

  const { homeTopPerformer, awayTopPerformer } = location.state || {};

<<<<<<< HEAD
=======

>>>>>>> origin/main
  const placeholder = placeholderImg;

  // Function to handle finish button click
  const handleFinish = () => {
    sessionStorage.clear();
    navigate('/');
  };

  const handleBack = () => {
    navigate('/matchup-page');
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
  };

  // Dynamically import player images based on team and player names
  const getTopPerformerPerformance = async (team, player) => {
    try {
      const module = await import(
        `../assets/all_players_scatter_plots/${team}/${player.name}.png`
      );
      return module.default;
    } catch (error) {
      console.error('Error fetching player image:', error);
      return null;
    }
  };

  const getTeamPerformance = async (team) => {
    try {
      const module = await import(`../assets/team_graphs/${team}.png`);
      return module.default;
    } catch (error) {
      console.error('Error fetching team performance image:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadContent = async () => {
      if (!homeTopPerformer) {
        setLoadingHomeTopPerformer(false);
      } else {
        try {
          const homeImage = await getTopPerformerPerformance(homeTeam, homeTopPerformer);
          setHomeTopPerformerGraph(homeImage);
        } catch (error) {
          console.error('Error loading home top performer:', error);
        } finally {
          setLoadingHomeTopPerformer(false);
        }
      }

      if (!awayTopPerformer) {
        setLoadingAwayTopPerformer(false);
      } else {
        try {
          const awayImage = await getTopPerformerPerformance(awayTeam, awayTopPerformer);
          setAwayTopPerformerGraph(awayImage);
        } catch (error) {
          console.error('Error loading away top performer:', error);
        }
      }

      try {
        // Retrieve predict scores
        const predictResponse = await fetch(
          'http://localhost:3000/api/predict/final-score',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              homeTeam: homeTeamID,
              homeTeamIDs: homeTeamNBAIds,
              awayTeam: awayTeamID,
              awayTeamIDs: awayTeamNBAIds,
            }),
          },
        );

        const predictScore = await predictResponse.json();
        setJsonHomeScorePB(predictScore.homePrediction);
        setJsonAwayScorePB(predictScore.awayPrediction);
        setJsonHomeScore(predictScore.TBhomePrediction);
        setJsonAwayScore(predictScore.TBawayPrediction);
        setJsonHomeScoreRF(predictScore.homePredScore);
        setJsonAwayScoreRF(predictScore.awayPredScore);

        setLoadingScores(false);

        const homeTeamGraph = await getTeamPerformance(homeTeam);
        setHomeTeamPerformanceGraph(homeTeamGraph);

        const awayTeamGraph = await getTeamPerformance(awayTeam);
        setAwayTeamPerformanceGraph(awayTeamGraph);
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, [homeTeam, awayTeam, homeTopPerformer, awayTopPerformer]);

  // Get scores based on selected model, default to empty if no model is selected
  const { homeScore, awayScore } = modelScores[selectedModel] || {
    homeScore: '-',
    awayScore: '-',
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Heading */}
      <div className="text-center my-8">
        <h1 className="text-5xl font-bold">Prediction Scores</h1>
      </div>

      {/* Prediction Box */}
      <div className="flex flex-col md:flex-row justify-around items-center mb-8 space-y-4 md:space-y-0">
        {/* Left Team */}
        <div className="text-center">
          <img
            src={teamLogos[homeTeam] || placeholder}
            alt={`${homeTeam} logo`}
            className="w-24 h-24 mx-auto"
          />
          <h2 className="text-2xl font-bold">{homeTeam}</h2>
          <div className="text-4xl font-bold md:hidden">
            {loadingScores ? (
              <div className="skeleton w-16 h-8"></div>
            ) : (
              homeScore
            )}
          </div>{' '}
          {/* Show score here for small screens */}
        </div>

        {/* Scores */}
        <div className="hidden md:block text-4xl font-bold">
          {loadingScores ? (
            <div className="skeleton w-16 h-8"></div>
          ) : (
            homeScore
          )}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">VS</h2>
        </div>
        <div className="hidden md:block text-4xl font-bold">
          {loadingScores ? (
            <div className="skeleton w-16 h-8"></div>
          ) : (
            awayScore
          )}
        </div>

        {/* Right Team */}
        <div className="text-center">
          <img
            src={teamLogos[awayTeam] || placeholder}
            alt={`${awayTeam} logo`}
            className="w-24 h-24 mx-auto"
          />
          <h2 className="text-2xl font-bold">{awayTeam}</h2>
          <div className="text-4xl font-bold md:hidden">
            {loadingScores ? (
              <div className="skeleton w-16 h-8"></div>
            ) : (
              awayScore
            )}
          </div>{' '}
          {/* Show score here for small screens */}
        </div>
      </div>

      {/* Dropdown */}
      <div className="form-control w-full max-w-xs mx-auto mb-8">
        <label className="label">
          <span className="label-text">Choose Model</span>
        </label>
        <select
          className="select select-bordered"
          onChange={(e) => handleModelSelect(e.target.value)}
          value={selectedModel}
        >
          <option value="" disabled>
            SELECT ML MODEL
          </option>
          <option value="Model 1">Model 1</option>
          <option value="Model 2">Model 2</option>
          <option value="Model 3">Model 3</option>
        </select>
      </div>

      {/* Top Performers */}
      <div className="card bg-base-300 rounded-box p-4 w-full">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-3xl font-bold text-center my-4">
            Top Performers
          </h2>
          <div
            className="tooltip ml-2 tooltip-right"
            data-tip="Top performers of each team based on impact: AVG (Average points/game), PPG (Points/game), RPG (Rebounds/game)"
          >
            <TooltipIcon />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4 justify-between">
          {/* Top Performer 1 - Home Team */}
          <div className="flex-grow grid place-items-center p-4">
            {loadingHomeTopPerformer ? (
              <div className="skeleton w-full h-full"></div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-5">{`${homeTeam}`}</h3>
                <div className="card bg-base-100 w-96 shadow-xl">
                  <figure className="px-10 pt-10">
                    <img
                      src={placeholder}
                      alt={homeTopPerformer?.name}
                      className="w-32 h-32 mx-auto mb-4 rounded-full"
                    />                    <img
                      src={teamLogos[homeTeam] || placeholder}
                      alt={`${homeTeam} logo`}
                      className="w-24 h-24 mx-auto"
                    />
                    <h2 className="text-2xl font-bold">{homeTeam}</h2>
                    <div className="text-4xl font-bold md:hidden">
                      {loadingScores ? (
                        <div className="skeleton w-16 h-8"></div>
                      ) : (
                        `${homeScore}%`
                      )}
                    </div>{' '}
                    {/* Show score here for small screens */}
                    </div>
                    
                    {/* Scores */}
                    <div className="hidden md:block text-4xl font-bold">
                      {loadingScores ? (
                        <div className="skeleton w-16 h-8"></div>
                      ) : (
                        `${homeScore}%`
                      )}
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">VS</h2>
                    </div>
                    <div className="hidden md:block text-4xl font-bold">
                      {loadingScores ? (
                        <div className="skeleton w-16 h-8"></div>
                      ) : (
                        `${awayScore}%`
                      )}
                    </div>
                    
                    {/* Right Team */}
                    <div className="text-center">
                      <img
                        src={teamLogos[awayTeam] || placeholder}
                        alt={`${awayTeam} logo`}
                        className="w-24 h-24 mx-auto"
                      />
                      <h2 className="text-2xl font-bold">{awayTeam}</h2>
                      <div className="text-4xl font-bold md:hidden">
                        {loadingScores ? (
                          <div className="skeleton w-16 h-8"></div>
                        ) : (
                          `${awayScore}%`
                        )}
                      </div>{' '}
                      {/* Show score here for small screens */}
                    </div>
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{homeTopPerformer?.name}</h2>
                    <p>APG: {homeTopPerformer?.stats.assistsPerGame}</p>
                    <p>PPG: {homeTopPerformer?.stats.pointsPerGame}</p>
                    <p>RPG: {homeTopPerformer?.stats.reboundsPerGame}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Top Performer 2 - Away Team*/}
          <div className="flex-grow grid place-items-center p-4">
            {!loadingAwayTopPerformer ? (
              <div className="skeleton w-full h-full"></div>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-5">{`${awayTeam}`}</h3>
                <div className="card bg-base-100 w-96 shadow-xl">
                  <figure className="px-10 pt-10">
                    <img
                      src={placeholder}
                      alt={awayTopPerformer?.name}
                      className="w-32 h-32 mx-auto mb-4 rounded-full"
                    />
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">{awayTopPerformer?.name}</h2>
                    <p>APG: {awayTopPerformer?.stats.assistsPerGame}</p>
                    <p>PPG: {awayTopPerformer?.stats.pointsPerGame}</p>
                    <p>RPG: {awayTopPerformer?.stats.reboundsPerGame}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Container: 4 Quadrants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Left: Home Team Graph */}
        <div className="card shadow-lg bg-base-100 p-4">
          <div className="card-body flex flex-col items-center">
            <h3 className="card-title text-center">{`${homeTeam} Overall Performance`}</h3>
            {/* Placeholder for Graph */}
            <figure className="flex justify-center items-center p-2">
              {homeTeamPerformanceGraph ? (
                <img
                  src={homeTeamPerformanceGraph}
                  alt={`${homeTeam} Performance`}
                  className="w-3/4 object-contain rounded-b-lg"
                />
              ) : (
                <p>No available data</p>
              )}
            </figure>
          </div>
        </div>

        {/* Top Right: Away Team Graph */}
        <div className="card shadow-lg bg-base-100 p-4">
          <div className="card-body flex flex-col items-center">
            <h3 className="card-title text-center">{`${awayTeam} Overall Performance`}</h3>
            <figure className="flex justify-center items-center p-2">
              {awayTeamPerformanceGraph ? (
                <img
                  src={awayTeamPerformanceGraph}
                  alt={`${awayTeam} Performance`}
                  className="w-3/4 object-contain rounded-b-lg"
                />
              ) : (
                <p>No available data</p>
              )}
            </figure>
          </div>
        </div>

        {/* Bottom Left: Team 1 Top Performer Scatterplot */}
        <div className="card shadow-lg bg-base-100 p-2">
          <div className="card-body flex flex-col items-center">
            <h3 className="card-title text-center">{`${homeTeam} Top Performer Scatterplot`}</h3>
            <figure className="flex justify-center items-center p-2">
              {homeTopPerformerGraph ? (
                <img
                  src={homeTopPerformerGraph}
                  alt={homeTopPerformer?.name}
                  className="w-3/4 object-contain rounded-b-lg"
                />
              ) : (
                <p>No available data</p>
              )}
            </figure>
          </div>
        </div>

        {/* Bottom Right: Team 2 Top Performer Scatterplot */}
        <div className="card shadow-lg bg-base-100 p-2">
          <div className="card-body flex flex-col items-center">
            <h3 className="card-title text-center">{`${awayTeam} Top Performer Scatterplot`}</h3>
            <figure className="flex justify-center items-center p-2">
              {awayTopPerformerGraph ? (
                <img
                  src={awayTopPerformerGraph}
                  alt={awayTopPerformer?.name}
                  className="w-3/4 object-contain rounded-b-lg"
                />
              ) : (
                <p>No available data</p>
              )}
            </figure>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col items-center py-10 mt-8 space-y-5">
        <button
          className="btn btn-accent btn-lg transition-transform transform hover:scale-110 hover:bg-accent-focus"
          onClick={handleFinish}
        >
          Finish
        </button>
        <button className="btn btn-secondary btn-outline" onClick={handleBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PredictionPage;
