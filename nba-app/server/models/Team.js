import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  division: {
    type: String,
    required: true,
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,  // References to Player model
    ref: 'Player',
  }],
  nbaID: {
    type: String,
    required: true
  }
});

const Team = mongoose.model('Team', TeamSchema);

export default Team;