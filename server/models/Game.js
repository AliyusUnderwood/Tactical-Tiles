const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentBoard: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'PLAYER_WON', 'AI_WON', 'DRAW'],
    default: 'IN_PROGRESS'
  },
  aiDifficulty: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    default: 'MEDIUM'
  },
  moves: [{
    from: String,
    to: String,
    piece: String,
    timestamp: Date
  }]
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;