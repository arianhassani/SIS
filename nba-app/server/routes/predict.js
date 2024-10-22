import express from 'express';
import { predictMatchOutcome } from '../dataPopulation/predictMatch.js'; // This will handle communication with the PyTorch model

const router = express.Router();

router.post('/predict', async (req, res) => {
  const { teamA, teamB, lineupA, lineupB } = req.body;
  try {
    const probabilities = await predictMatchOutcome(teamA, teamB, lineupA, lineupB);
    res.json(probabilities); // Send the prediction result back to the frontend
  } catch (error) {
    res.status(500).json({ error: 'Error processing prediction' });
  }
});

export default router;