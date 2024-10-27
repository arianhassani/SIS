import express from 'express';
import {
  playerInjured,
  playerResolved
} from "../controllers/playersController.js";

const router = express.Router();

// Route to mark a player as injured
router.put('/:playerId/injured', playerInjured);

// Route to resolve a player's injury
router.put('/:playerId/resolve', playerResolved);

export default router;