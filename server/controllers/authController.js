const { User } = require('../models');
const BlacklistedToken = require('../models/BlacklistedToken');
const { signToken } = require('../utils/auth');

module.exports = {
  // Handle user signup
  async signup({ body }, res) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Create new user and generate token
      const user = await User.create(body);
      const token = signToken(user);
      res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(400).json({ message: 'Unable to create user', error: err.message });
    }
  },

  // Handle user login
  async login({ body }, res) {
    try {
      // Find user by email
      const user = await User.findOne({ email: body.email });
      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }
  
      // Verify password
      const correctPw = await user.isCorrectPassword(body.password);
      if (!correctPw) {
        return res.status(400).json({ message: 'Wrong password!' });
      }
  
      // Generate and send token
      const token = signToken(user);
      res.json({ token, user: { _id: user._id, username: user.username, email: user.email } });
    } catch (err) {
      console.error('Login error:', err);
      res.status(400).json({ message: 'Unable to log in', error: err.message });
    }
  },

  // Handle user logout
  logout: async (req, res) => {
    try {
      // Extract token from authorization header
      const token = req.headers.authorization.split(' ')[1];
      // Add token to blacklist
      await BlacklistedToken.create({ token });
      res.json({ message: 'Logged out successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error logging out', error: err.message });
    }
  },
};