const mongoose = require('mongoose');

// mongodb://127.0.0.1:27017/TacticalTilesDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://collinsjosephj:Subaru123!@tacticaltilesdb.r9pwhwe.mongodb.net/?retryWrites=true&w=majority&appName=TacticalTilesDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
  
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = mongoose.connection;
