import express from 'express';
import Team from '../models/Team.js';
const router = express.Router();

// Route to get all teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find(); // Fetch all teams from MongoDB
        res.status(200).json(teams); // Send the list of teams as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
});

// Route to get players for a given team
router.get('/:teamName/players', async (req, res) => {
    try {
      const { teamName } = req.params;
  
      // Find the team by name
      const team = await Team.findOne({ name: teamName }).populate('players');
  
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

// Route to get updated players for a given team via live injuries api
router.get('/:teamName/updated-players', async (req, res) => {
    const { teamName } = req.params;
  
    try {
      // First, update the injury status of players by calling setInjuredPlayers
      await setInjuredPlayers(teamName);
  
      // Find the team by the given team name
      const team = await Team.findOne({ name: teamName });
  
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      // Find all injured players from the team
      const injuredPlayers = await Player.find({
        _id: { $in: team.players },  // Only search for players in the team
      });
  
      // Return the list of injured players
      res.status(200).json(injuredPlayers);
    } catch (error) {
      console.error(`Error fetching injured players: ${error.message}`);
      res.status(500).json({ message: 'Server error' });
    }
});

export default router;