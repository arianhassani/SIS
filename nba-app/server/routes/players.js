import express from 'express';
import Team from '../models/Team.js'; // Adjust the import based on your file structure
import Player from '../models/Player.js'
import path from 'path';
import setInjuredPlayers from "../dataPopulation/injuryUpdate.js";

export const router = express.Router();

// Route to mark a player as injured
router.put('/:playerId/injured', async (req, res) => {
  try {
    const { playerId } = req.params;
    const { description } = req.body;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.isInjured = true;
    player.injuryDetails = description;
    await player.save();

    res.status(200).json({ message: 'Player marked as injured' });
  } catch (error) {
    console.error('Error marking player as injured:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to resolve a player's injury
router.put('/:playerId/resolve', async (req, res) => {
  try {
    const { playerId } = req.params;

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    player.isInjured = false;
    player.injuryDetails = '';
    await player.save();

    res.status(200).json({ message: 'Player injury resolved' });
  } catch (error) {
    console.error('Error resolving player injury:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;