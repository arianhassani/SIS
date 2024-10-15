import fs from 'fs';
import path from 'path';
import Team from '../models/Team.js';  // Assuming these models are in your models folder
import Player from '../models/Player.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import "dotenv/config.js";
import { exec } from 'child_process';

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

const setInjuredPlayers = async (teamName) => {
  try {
    // Run the Python script
    exec('py nbainjuries.py', async (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error.message}`);
        throw new Error('Server error running Python script');
      }

      if (stderr) {
        console.error(`Python script stderr: ${stderr}`);
        throw new Error('Python script error');
      }

      // Parse the output from the Python script
      let injuryData;
      try {
        injuryData = JSON.parse(stdout);
        console.log('Injury Data:', injuryData);
      } catch (err) {
        console.error(`Error parsing JSON from Python script: ${err.message}`);
        throw new Error('Error parsing Python script output');
      }

      // After parsing the injury data, find the team and update player statuses
      try {
        // Find the team by the provided teamName
        const team = await Team.findOne({ name: teamName });
        if (!team) {
          console.error(`Team ${teamName} not found`);
          throw new Error('Team not found');
        }

        // Loop through each player in the team and update their injury status
        for (let playerId of team.players) {
          const player = await Player.findById(playerId);
          if (!player) {
            console.error(`Player with ID ${playerId} not found`);
            continue;
          }

          // Check if the player's name is in the injuryData
          const playerInjury = injuryData.find(injury => injury.player_name === player.name);

          // Update the player's injury status and details if injured
          if (playerInjury) {
            player.isInjured = true;

            player.injuryDetails = `${playerInjury.injury_type} - ${playerInjury.injury_status}`;

          } else {
            // If not injured, reset injury details
            player.isInjured = false;
            player.injuryDetails = "";
          }

          await player.save();  // Save the updated player
        }

        console.log(`Injury status updated for team ${teamName}`);
      } catch (err) {
        console.error(`Error in setInjuredPlayers: ${err.message}`);
        throw new Error('Server error updating player statuses');
      }
    });
  } catch (err) {
    console.error(`Error in setInjuredPlayers: ${err.message}`);
    throw new Error('Server error');
  }
};

//populateTeams();
//populatePlayers();
setInjuredPlayers("Atlanta Hawks");




