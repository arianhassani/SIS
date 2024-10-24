import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import teamRoutes from './routes/teams.js'; // Import the teams route
import playerRoutes from './routes/players.js'; // Import the players route

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.listen(port, () => {
  console.log('Server listening on ' + port);
});

// Use the teams route
app.use('/', teamRoutes);

// Use the players route

app.use('/', playerRoutes);
