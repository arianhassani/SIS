import { predictMatchOutcome } from '../dataPopulation/predictMatch.js'; // This will handle communication with the PyTorch model
import Player from '../models/Player.js';

// Get final score prediction
const getFinalScore = async (req, res) => {
  const homeTeam = req.body.homeTeam;
  const homeTeamPlayers = req.body.homeTeamIDs;
  const awayTeam = req.body.awayTeam;
  const awayTeamPlayers = req.body.awayTeamIDS;

  try {
    const probabilities = await predictMatchOutcome(homeTeam, awayTeam, homeTeamPlayers, awayTeamPlayers);
    const predictionPercentage = (probabilities.tft * 100).toFixed(0);
    const predictionAway = (100 - predictionPercentage).toString();
    const predictionPercentageTeamBased = (probabilities.tft_team_only * 100).toFixed(0);
    const predictionAwayTeamBased = (100 - predictionPercentageTeamBased).toString();
    res.json({ homePrediction: predictionPercentage, awayPrediction: predictionAway, 
      TBhomePrediction: predictionPercentageTeamBased, TBawayPrediction: predictionAwayTeamBased}); // Send the prediction result back to the frontend
  } catch (err) {
    console.error('Error processing prediction:', err);
    res.status(500).json({ message: 'Error processing prediction' });
  }
};

// Get top performer for given teams
const getTopPerformer = async (req, res) => {
  try {
    const playerIds = req.body.playerIds; // Array of player IDs sent from the frontend

    // Fetch the players based on their IDs
    const players = await Player.find({
      _id: { $in: playerIds },
    });

    // Check if all 5 players were found
    if (players.length !== 5) {
      return res.status(400).json({
        message: 'Invalid player lineup. Make sure all players exist.',
      });
    }

    // Find the top performer based on totalAvg
    let topPerformer = players.reduce((top, player) => {
      return player.stats.totalAvg > top.stats.totalAvg ? player : top;
    });

    // Return the top performer data
    res.json(topPerformer);
  } catch (err) {
    console.error('Error finding top performer:', err);
    res
      .status(500)
      .json({ message: 'An error occurred while processing the request.' });
  }
};

export { getFinalScore, getTopPerformer };
