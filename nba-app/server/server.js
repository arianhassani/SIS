import express from 'express';
import cors from 'cors';

import connectDB from './config/db.js';
import teamRoutes from './routes/teams.js'; // Import the teams route
import playerRoutes from './routes/players.js'; // Import the players route
import predictRoutes from './routes/predict.js'; // Import the players route

const port = process.env.PORT || 3000;
const app = express();

// Connect to the database
connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route setup
app.use('/api/teams', teamRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/predict', predictRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
