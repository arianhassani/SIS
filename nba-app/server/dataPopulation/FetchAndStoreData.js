import fs from 'fs';
import path from 'path';
import Team from '../models/Team.js'; // Assuming these models are in your models folder
import Player from '../models/Player.js';
import connectDB from '../config/db.js';
import 'dotenv/config.js';

//console.log(process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

const teamData = JSON.parse(
  fs.readFileSync(path.resolve('./responseTeams.json'), 'utf-8'),
);
const playerData = JSON.parse(
  fs.readFileSync(path.resolve('./players.json'), 'utf-8'),
);
const statsData = JSON.parse(
  fs.readFileSync(path.resolve('./playerStats.json'), 'utf-8'),
);
const nbaIDs = JSON.parse(
  fs.readFileSync(path.resolve('./unique_teams.json'), 'utf-8'),
);

const transformedTeamData = teamData.data.map((team) => ({
  name: team.full_name,
  abbreviation: team.abbreviation,
  city: team.city,
  division: team.division,
  // Map the rest of the fields accordingly
}));

// Function to populate data
const populateTeams = async () => {
  try {
    // First, clear the existing collection (optional)
    await Team.deleteMany();

    // Insert the new teams data
    await Team.insertMany(transformedTeamData);
    console.log('Teams data inserted successfully!');
  } catch (error) {
    console.error('Error inserting teams data:', error);
  }
};

const populatePlayers = async () => {
  try {
    // Clear existing players (optional)
    await Player.deleteMany();

    // Clear the player IDs from the teams
    await Team.updateMany({}, { $set: { players: [] } }); // Set the players array to an empty array

    for (const player of playerData) {
      // Find the team by name
      const team = await Team.findOne({ name: player.player_team }); // Assuming player.teamName contains the team's name
      if (team) {
        // Create the player
        const newPlayer = new Player({
          name: player.player_name,
          position: player.player_position,
          team: team._id, // Store the reference to the team
        });

        // Save the player to the database
        await newPlayer.save();

        // Optionally push the player ID to the team's players array
        team.players.push(newPlayer._id);
        await team.save();
      }
    }
    console.log('Players data inserted successfully!');
  } catch (error) {
    console.error('Error inserting players data:', error);
  }
};

// Helper function to calculate totalAvg
const calculateTotalAvg = (pointsPerGame, reboundsPerGame, assistsPerGame) => {
  return pointsPerGame + reboundsPerGame + assistsPerGame;
};

// Update each player in the database
const updatePlayerStats = async () => {
  for (const playerStat of statsData) {
    const {
      Player: playerName,
      TRB: rebounds,
      AST: assists,
      PTS: points,
    } = playerStat;

    // Convert string stats to numbers
    const pointsPerGame = parseFloat(points);
    const reboundsPerGame = parseFloat(rebounds);
    const assistsPerGame = parseFloat(assists);
    const totalAvg = calculateTotalAvg(
      pointsPerGame,
      reboundsPerGame,
      assistsPerGame,
    );

    // Update the player record in MongoDB
    const updatedPlayer = await Player.findOneAndUpdate(
      { name: playerName }, // Find player by name
      {
        'stats.pointsPerGame': pointsPerGame,
        'stats.reboundsPerGame': reboundsPerGame,
        'stats.assistsPerGame': assistsPerGame,
        'stats.totalAvg': totalAvg,
      },
      { new: true }, // Return the updated document
    );

    if (updatedPlayer) {
      console.log(`Updated stats for ${playerName}`);
    } else {
      console.log(`Player ${playerName} not found in database.`);
    }
  }
};

// Update each team in the database
const setNBAIDs = async () => {
  for (const eachID of nbaIDs) {
    const { TEAM_ID: teamID, TEAM_NAME: teamName } = eachID;
    const teamIDString = teamID.toString();

    // Update the team record in MongoDB
    const updatedTeam = await Team.findOneAndUpdate(
      { name: teamName }, // Find player by name
      { nbaID: teamIDString },
      { new: true }, // Return the updated document
    );
    if (updatedTeam) {
      console.log(`NBA Id added for ${teamName}`);
    } else {
      console.log(`Team ${teamName} not found in database.`);
    }
  }
};

//setNBAIDs();
// Execute the function
//updatePlayerStats().catch(err => console.log(err));

//populateTeams();
//populatePlayers();
