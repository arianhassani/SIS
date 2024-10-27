import express from 'express';
import {
  getTeams,
  getTeamPlayers,
  getUpdatedTeamPlayers,
} from '../controllers/teamsController.js';

const router = express.Router();

// Route to get all teams
router.get('/', getTeams);

// Route to get players for a given team
router.get('/:teamName/players', getTeamPlayers);

// Route to get updated players for a given team
router.get('/:teamName/updated-players', getUpdatedTeamPlayers);

export default router;
