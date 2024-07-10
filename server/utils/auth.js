const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // Middleware to authenticate requests
  authMiddleware: async function (req, res, next) {
    // Extract token from query or headers
    let token = req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      // Check for incomplete "Bearer" token
      if (req.headers.authorization.toLowerCase() === 'bearer') {
        return res.status(401).json({ message: 'Token is missing' });
      }
      
      // Extract token from "Bearer <token>" format
      token = req.headers.authorization.split(' ').pop().trim();
    }

    // Ensure token exists
    if (!token) {
      return res.status(401).json({ message: 'You have no token!' });
    }

    try {
      // Check if token is blacklisted (logged out)
      const blacklistedToken = await BlacklistedToken.findOne({ token });
      if (blacklistedToken) {
        return res.status(401).json({ message: 'Token is no longer valid' });
      }

      // Verify and decode token
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token!' });
    }
  },

  // Generate a new JWT for a user
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};