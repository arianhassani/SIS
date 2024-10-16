import fs from 'fs';
import path from 'path';
import Team from '../models/Team.js'; 
import Player from '../models/Player.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import "dotenv/config.js";
import { exec } from 'child_process';
import util from 'util';

connectDB();
const execPromise = util.promisify(exec);

const setInjuredPlayers = async (teamName) => {
  try {
    // Run the Python script and await the result
    const { stdout, stderr } = await execPromise('py ./dataPopulation/nbainjuries.py');

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
  };

  //console.log("testing");
  //setInjuredPlayers("Charlotte Hornets");
  export default setInjuredPlayers;