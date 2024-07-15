const mongoose = require('mongoose');
const { Game: ChessGame } = require('js-chess-engine');

const moveSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  piece: {
    type: String,
    required: true,
    default: 'P' // Default to pawn if not specified
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const gameSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentBoard: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        try {
          JSON.parse(v);
          return true;
        } catch (error) {
          return false;
        }
      },
      message: props => `${props.value} is not a valid JSON string!`
    }
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'PLAYER_WON', 'AI_WON', 'DRAW'],
    default: 'IN_PROGRESS'
  },
  aiDifficulty: {
    type: Number,
    min: 0,
    max: 4,
    default: 2,  // Equivalent to 'MEDIUM'
    required: true
  },
  moves: {
    type: [moveSchema],
    default: []
  }
}, { timestamps: true });

// Middleware to convert string difficulty to number before saving
gameSchema.pre('save', function(next) {
  if (this.isModified('aiDifficulty') && typeof this.aiDifficulty === 'string') {
    const difficultyMap = {
      'EASY': 1,
      'MEDIUM': 2,
      'HARD': 3,
      'EXPERT': 4
    };
    this.aiDifficulty = difficultyMap[this.aiDifficulty] || 2;  // Default to MEDIUM if invalid
  }
  next();
});

// Virtual for getting the last move
gameSchema.virtual('lastMove').get(function() {
  if (this.moves.length > 0) {
    return this.moves[this.moves.length - 1];
  }
  return null;
});

// Method to get a ChessGame instance from the current board state
gameSchema.methods.getChessGame = function() {
  return new ChessGame(JSON.parse(this.currentBoard));
};

// Method to update the current board state from a ChessGame instance
gameSchema.methods.updateFromChessGame = function(chessGame) {
  this.currentBoard = JSON.stringify(chessGame.exportJson());
};

// Method to add a new move
gameSchema.methods.addMove = function(from, to, piece) {
  this.moves.push({ from, to, piece });
};

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;