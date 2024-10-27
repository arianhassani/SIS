import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import teamLogos from '../components/teamLogos';

const PredictionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [selectedModel, setSelectedModel] = useState('SELECT ML MODEL');
  const [homeTopPerformerGraph, setHomeTopPerformerGraph] = useState('');
  const [awayTopPerformerGraph, setAwayTopPerformerGraph] = useState('');
  const [homeTeamPerformanceGraph, setHomeTeamPerformanceGraph] = useState('');
  const [awayTeamPerformanceGraph, setAwayTeamPerformanceGraph] = useState('');

  // Retrieve the team names from session storage or use fallback values
  const homeTeam =
    sessionStorage.getItem('homeTeam') || 'No home team selected';
  const awayTeam =
    sessionStorage.getItem('awayTeam') || 'No home team selected';

  const { homeTopPerformer, awayTopPerformer } = location.state || {};

  const predictedScores = {
    left: 100, // Replace with actual predicted score
    right: 98, // Replace with actual predicted score
  };

  const placeholder = 'https://placehold.co/400';

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
      setError(true);
      return placeholder; // Placeholder image URL
    }
  };

  const getTeamPerformance = async (team) => {
    try {
      const module = await import(`../assets/team_graphs/${team}.png`);
      return module.default;
    } catch (error) {
      console.error('Error fetching team performance image:', error);
      setError(true);
      return placeholder;
    }
  };

  useEffect(() => {
    const loadImages = async () => {
      if (!homeTopPerformer || !awayTopPerformer) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const homeImage = await getTopPerformerPerformance(
          homeTeam,
          homeTopPerformer,
        );
        const awayImage = await getTopPerformerPerformance(
          awayTeam,
          awayTopPerformer,
        );
        const homeTeamGraph = await getTeamPerformance(homeTeam);
        const awayTeamGraph = await getTeamPerformance(awayTeam);
        setHomeTeamPerformanceGraph(homeTeamGraph);
        setAwayTeamPerformanceGraph(awayTeamGraph);
        setHomeTopPerformerGraph(homeImage);
        setAwayTopPerformerGraph(awayImage);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [homeTeam, awayTeam, homeTopPerformer, awayTopPerformer]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="skeleton w-full h-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-error"></span>
      </div>
    );
  }

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
            {predictedScores.left}
          </div>{' '}
          {/* Show score here for small screens */}
        </div>

        {/* Scores */}
        <div className="hidden md:block text-4xl font-bold">
          {predictedScores.left}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">VS</h2>
        </div>
        <div className="hidden md:block text-4xl font-bold">
          {predictedScores.right}
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
            {predictedScores.right}
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
        >
          <option value="SELECT ML MODEL" disabled>
            SELECT ML MODEL
          </option>
          <option value="Model 1">Model 1</option>
          <option value="Model 2">Model 2</option>
          <option value="Model 3">Model 3</option>
        </select>
      </div>

      {/* Top Performers */}
      <div className="card bg-base-300 rounded-box p-4 w-full">
        <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4 justify-between">
          {/* Top Performer 1 */}
          <div className="flex-grow grid place-items-center p-4">
            <h3 className="text-xl font-semibold mb-4">{`${homeTeam} Top Performer`}</h3>
            <div className="card bg-base-100 w-96 shadow-xl">
              <figure className="px-10 pt-10">
                <img
                  src={placeholder}
                  alt={homeTopPerformer?.name}
                  className="w-32 h-32 mx-auto mb-4 rounded-full"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{homeTopPerformer?.name}</h2>
                <p>APG: {homeTopPerformer?.stats.assistsPerGame}</p>
                <p>PPG: {homeTopPerformer?.stats.pointsPerGame}</p>
                <p>RPG: {homeTopPerformer?.stats.reboundsPerGame}</p>
              </div>
            </div>
          </div>

          {/* Top Performer 2 */}
          <div className="flex-grow grid place-items-center p-4">
            <h3 className="text-xl font-semibold mb-4">{`${awayTeam} Top Performer`}</h3>
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
              <img
                src={homeTeamPerformanceGraph || placeholder}
                alt={`${homeTeam} Performance`}
                className="w-3/4 object-contain rounded-b-lg"
              />
            </figure>
          </div>
        </div>

        {/* Top Right: Away Team Graph */}
        <div className="card shadow-lg bg-base-100 p-4">
          <div className="card-body flex flex-col items-center">
            <h3 className="card-title text-center">{`${awayTeam} Overall Performance`}</h3>
            <figure className="flex justify-center items-center p-2">
              <img
                src={awayTeamPerformanceGraph || placeholder}
                alt={`${awayTeam} Performance`}
                className="w-3/4 object-contain rounded-b-lg"
              />
            </figure>
          </div>
        </div>

        {/* Bottom Left: Team 1 Top Performer Scatterplot */}
        <div className="card shadow-lg bg-base-100 p-2">
          <div className="card-body flex flex-col items-center">
            <h3 className="card-title text-center">{`${homeTeam} Top Performer Scatterplot`}</h3>
            <figure className="flex justify-center items-center p-2">
              <img
                src={homeTopPerformerGraph || placeholder}
                alt={homeTopPerformer?.name}
                className="w-3/4 object-contain rounded-b-lg"
              />
            </figure>
          </div>
        </div>

        {/* Bottom Right: Team 2 Top Performer Scatterplot */}
        <div className="card shadow-lg bg-base-100 p-2">
          <div className="card-body flex flex-col items-center">
            <h3 className="card-title text-center">{`${awayTeam} Top Performer Scatterplot`}</h3>
            <figure className="flex justify-center items-center p-2">
              <img
                src={awayTopPerformerGraph || placeholder}
                alt={awayTopPerformer?.name}
                className="w-3/4 object-contain rounded-b-lg"
              />
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
