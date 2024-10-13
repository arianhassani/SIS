import express from 'express';
import Team from '../models/Team.js'; // Adjust the import based on your file structure
import Player from '../models/Player.js'

const router = express.Router();

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

export default router;