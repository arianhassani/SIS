import express from 'express';
import Team from '../models/Team.js'; // Import your Team model
import Player from '../models/Player.js'; // Import your Player model
import setInjuredPlayers from '../dataPopulation/injuryUpdate.js'; // Import your injury update function

const router = express.Router();

// Route to get players for a given team
router.get('/:teamName/players', async (req, res) => {
  try {
    const { teamName } = req.params;

    console.log(`Received teamName: ${teamName}`);

    // Use a case-insensitive regex for team name search
    const team = await Team.findOne({ name: { $regex: new RegExp(`^${teamName}$`, 'i') } }).populate('players');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Return the players associated with the team
    res.status(200).json({ players: team.players });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to get injured players for a given team
router.get('/:teamName/injuredPlayers', async (req, res) => {
  const { teamName } = req.params;

  try {
    // First, update the injury status of players by calling setInjuredPlayers
    await setInjuredPlayers(teamName);

    // Find the team by the given team name
    const team = await Team.findOne({ name: { $regex: new RegExp(`^${teamName}$`, 'i') } });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Find all injured players from the team
    const injuredPlayers = await Player.find({
      _id: { $in: team.players },  // Only search for players in the team
      isInjured: true              // Only retrieve injured players
    });

    // Return the list of injured players
    res.status(200).json(injuredPlayers);
  } catch (error) {
    console.error(`Error fetching injured players: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to find top performer from a list of players
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
