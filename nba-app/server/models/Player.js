

const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  team: {
    //type: mongoose.Schema.Types.ObjectId,  // Reference to the Team model
    ref: 'Team',
    required: true,
  },
  isInjured: {
    type: Boolean,
    default: false,  // You can use this to track injury status
  },
  injuryDetails: {
    type: String,  // Optional field for injury reports
    default: '',
  },
  stats: {
    pointsPerGame: { type: Number, default: 0 },
    reboundsPerGame: { type: Number, default: 0 },
    assistsPerGame: { type: Number, default: 0 },
    // Add more fields as necessary
  }
});

module.exports = model('Player');