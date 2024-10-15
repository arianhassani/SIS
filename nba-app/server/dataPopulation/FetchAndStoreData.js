import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Team from '../models/Team.js';  // Assuming these models are in your models folder
//import Player from '../models/Player.js';
import connectDB from '../config/db.js';

// Connect to MongoDB 
connectDB();

const teamData = JSON.parse(fs.readFileSync(path.resolve('./responseTeams.json'), 'utf-8'));

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

populateTeams();




