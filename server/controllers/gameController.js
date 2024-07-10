const { Game } = require('../models');
const { Chess } = require('chess.js');
const chessAi = require('../utils/chessAi');

module.exports = {
  // Retrieve all games for the authenticated user
  getAllGames: async (req, res) => {
    console.log('getAllGames called, user:', req.user);
    try {
      if (!req.user) return res.status(401).json({ message: 'User not authenticated' });
      const games = await Game.find({ player: req.user._id });
      console.log(`Found ${games.length} games`);
      res.json(games);
    } catch (err) {
      console.error('Error in getAllGames:', err);
      res.status(500).json({ message: 'Error retrieving games', error: err.message });
    }
  },

  // Retrieve a specific game by ID for the authenticated user
  getGame: async (req, res) => {
    try {
      const game = await Game.findOne({ _id: req.params.id, player: req.user._id });
      if (!game) return res.status(404).json({ message: 'Game not found' });
      res.json(game);
    } catch (err) {
      console.error('Error in getGame:', err);
      res.status(500).json({ message: 'Error retrieving game', error: err.message });
    }
  },

  // Create a new game for the authenticated user
  createGame: async (req, res) => {
    try {
      const newGame = await Game.create({
        player: req.user._id,
        currentBoard: new Chess().fen(),
        aiDifficulty: req.body.aiDifficulty || 'MEDIUM',
        status: 'IN_PROGRESS'
      });
      res.status(201).json(newGame);
    } catch (err) {
      console.error('Error in createGame:', err);
      res.status(400).json({ message: 'Error creating game', error: err.message });
    }
  },

  // Make a move in a game and process AI response
  makeMove: async (req, res) => {
    try {
      console.log('makeMove called:', req.params, req.body);
      const game = await Game.findById(req.params.id);
      if (!game) return res.status(404).json({ message: 'Game not found' });

      const chess = new Chess(game.currentBoard);
      const move = { from: req.body.from, to: req.body.to, promotion: 'q' };
      const result = chess.move(move);

      if (!result) return res.status(400).json({ message: 'Invalid move' });

      game.currentBoard = chess.fen();
      game.moves.push({...move, piece: result.piece, timestamp: new Date()});

      // Handle game over or make AI move
      if (chess.isGameOver()) {
        game.status = chess.isCheckmate() ? 'PLAYER_WON' : 'DRAW';
      } else {
        // Process AI move
        const { fen: newFen, move: aiMove } = chessAi.makeMove(game.currentBoard, game.aiDifficulty);
        game.currentBoard = newFen;
        game.moves.push({...aiMove, timestamp: new Date()});

        const aiChess = new Chess(newFen);
        if (aiChess.isGameOver()) {
          game.status = aiChess.isCheckmate() ? 'AI_WON' : 'DRAW';
        }
      }

      await game.save();
      res.json(game);
    } catch (err) {
      console.error('Error in makeMove:', err);
      res.status(400).json({ message: 'Error making move', error: err.message });
    }
  },

  // Delete a specific game for the authenticated user
  deleteGame: async (req, res) => {
    try {
      const result = await Game.findOneAndDelete({ _id: req.params.id, player: req.user._id });
      if (!result) return res.status(404).json({ message: 'Game not found' });
      res.json({ message: 'Game deleted successfully' });
    } catch (err) {
      console.error('Error in deleteGame:', err);
      res.status(500).json({ message: 'Error deleting game', error: err.message });
    }
  }
};