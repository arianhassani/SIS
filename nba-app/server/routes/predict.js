import express from 'express';
import { predictMatchOutcome } from '../dataPopulation/predictMatch.js'; // This will handle communication with the PyTorch model

const router = express.Router();

router.post('/predict', async (req, res) => {
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

export default router;