

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  players: [{
    // type: mongoose.Schema.Types.ObjectId,  // References to Player model
    ref: 'Player',
  }],
});

module.exports = model('Team');