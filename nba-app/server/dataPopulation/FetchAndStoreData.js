import fs from 'fs';
import path from 'path';
import Team from '../models/Team.js';  // Assuming these models are in your models folder
import Player from '../models/Player.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import "dotenv/config.js";

console.log(process.env.MONGO_URI);

// Connect to MongoDB 
connectDB();

const teamData = JSON.parse(fs.readFileSync(path.resolve('./responseTeams.json'), 'utf-8'));
const playerData = JSON.parse(fs.readFileSync(path.resolve('./players.json'), 'utf-8')); 

const transformedTeamData = teamData.data.map(team => ({
  name: team.full_name,
  abbreviation: team.abbreviation,
  city: team.city,
  division: team.division
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
      // Find the team by ID
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

//populateTeams();
populatePlayers();




