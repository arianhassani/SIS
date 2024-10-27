import express from 'express';
import {
  getFinalScore,
  getTopPerformer
} from "../controllers/predictController.js";

const router = express.Router();

// Get final score prediction
router.post('/final-score', getFinalScore);

// Get top performer for given teams
router.post('/top-performer', getTopPerformer);

export default router;