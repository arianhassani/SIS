import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,  // References to Player model
    ref: 'Player',
  }],
});

const Team = mongoose.model('Team', teamSchema);

export default model('Team');