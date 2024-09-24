import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.listen(port, () => {
  console.log('Server listening on ' + port);
});

/* Sample data: list of teams
const teams = [
  { id: 1, name: 'Los Angeles Lakers' },
  { id: 2, name: 'Golden State Warriors' },
  { id: 3, name: 'Boston Celtics' },
  { id: 4, name: 'Chicago Bulls' },
]; */

// mock api for getting the list of teams
app.get('/teams', (req, res) => {
  res.json(teams);  
});
