const { GraphQLError } = require('graphql');
const { User, Game } = require('../models');
const { signToken } = require('../utils/auth');
const { Chess } = require('chess.js');
const chessAi = require('../utils/chessAi');

const resolvers = {
  Query: {
    // Fetch current user's data
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('games');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Fetch a specific game
    game: async (parent, { _id }, context) => {
      if (context.user) {
        return Game.findOne({ _id }).populate('player');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Fetch all games for the current user
    myGames: async (parent, args, context) => {
      if (context.user) {
        return Game.find({ player: context.user._id }).populate('player');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    // Create a new user account
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // User login
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !await user.isCorrectPassword(password)) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    // Create a new game
    createGame: async (parent, { aiDifficulty }, context) => {
      if (context.user) {
        const chess = new Chess();
        const game = await Game.create({
          player: context.user._id,
          currentBoard: chess.fen(),
          aiDifficulty,
        });
        await User.findByIdAndUpdate(context.user._id, { $push: { games: game._id } });
        return game.populate('player');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Make a move in a game
    makeMove: async (parent, { gameId, from, to }, context) => {
      if (context.user) {
        const game = await Game.findById(gameId);
        if (!game) throw new Error('Game not found');

        const chess = new Chess(game.currentBoard);
        const move = chess.move({ from, to, promotion: 'q' });
        if (move === null) throw new Error('Invalid move');

        // Update game state with player's move
        game.currentBoard = chess.fen();
        game.moves.push({ from, to, piece: move.piece, timestamp: new Date().toISOString() });

        // Check for game over after player's move
        if (chess.game_over()) {
          game.status = chess.in_checkmate() ? 'PLAYER_WON' : 'DRAW';
        } else {
          // Make AI move
          try {
            const { fen: newFen, move: aiMove } = chessAi.makeMove(game.currentBoard, game.aiDifficulty);
            game.currentBoard = newFen;
            game.moves.push({ ...aiMove, timestamp: new Date().toISOString() });

            // Check for game over after AI move
            const aiChess = new Chess(newFen);
            if (aiChess.game_over()) {
              game.status = aiChess.in_checkmate() ? 'AI_WON' : 'DRAW';
            }
          } catch (error) {
            console.error('AI move error:', error);
            throw new Error('Error during AI move');
          }
        }

        await game.save();
        return game.populate('player');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;