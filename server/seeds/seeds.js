require('dotenv').config();
const mongoose = require('mongoose');
const { User, Game } = require('../models');
const { Chess } = require('chess.js');
const seedData = require('./seed-data.json');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/TacticalTilesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Game.deleteMany({});

    // Seed users
    const createdUsers = await User.create(seedData.users);

    console.log('Users seeded successfully');

    // Seed games
    const createdGames = await Promise.all(seedData.games.map(async (game, index) => {
      const chess = new Chess();
      game.moves.forEach(move => chess.move(move));
      
      const newGame = await Game.create({
        ...game,
        player: createdUsers[index % createdUsers.length]._id,
        currentBoard: chess.fen(),
        moves: game.moves.map(move => ({...move, timestamp: new Date()}))
      });

      // Add game to user's games array
      await User.findByIdAndUpdate(createdUsers[index % createdUsers.length]._id, 
        { $push: { games: newGame._id } }
      );

      return newGame;
    }));

    console.log('Games seeded successfully');
    console.log('All seeds planted successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();