import { predictMatchOutcome } from '../dataPopulation/predictMatch.js'; // This will handle communication with the PyTorch model
import { router } from './players.js';

router.post('/final-score', async (req, res) => {
  const homeTeam = req.body.homeTeam;
  const awayTeam = req.body.awayTeam;

  try {
    const probabilities = await predictMatchOutcome(homeTeam, awayTeam);
    const predictionPercentage = (probabilities.tft * 100).toFixed(0);
    res.json(predictionPercentage); // Send the prediction result back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Error processing prediction' });
  }
});

router.post('/top-performer', async (req, res) => {
  try {
    const playerIds = req.body.playerIds; // Array of player IDs sent from the frontend

    // Fetch the players based on their IDs
    const players = await Player.find({
      _id: { $in: playerIds }
    });

    // Check if all 5 players were found
    if (players.length !== 5) {
      return res.status(400).json({ message: 'Invalid player lineup. Make sure all players exist.' });
    }

    // Find the top performer based on totalAvg
    let topPerformer = players.reduce((top, player) => {
      return player.stats.totalAvg > top.stats.totalAvg ? player : top;
    });

    // Return the top performer data
    res.json(topPerformer);

  } catch (err) {
    console.error('Error finding top performer:', err);
    res.status(500).json({ message: 'An error occurred while processing the request.' });
  }
});

export default router;