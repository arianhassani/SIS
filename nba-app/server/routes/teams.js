import express from 'express';
import Team from '../models/Team.js';

const router = express.Router();

// Route to get all teams
router.get('/teams', async (req, res) => {
    try {
        const teams = await Team.find(); // Fetch all teams from MongoDB
        res.status(200).json(teams); // Send the list of teams as JSON
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teams', error });
    }
});

export default router;