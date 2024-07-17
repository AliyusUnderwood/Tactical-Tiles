const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://collinsjosephj:atlas123@tacticaltilesdb.r9pwhwe.mongodb.net/TacticalTilesDB?retryWrites=true&w=majority&appName=TacticalTilesDB');

module.exports = mongoose.connection;
