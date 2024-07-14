const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/BlacklistedToken');
const { GraphQLError } = require('graphql');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: class AuthenticationError extends GraphQLError {
    constructor(message) {
      super(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }
  },

  // Middleware to authenticate requests and create context
  authMiddleware: async function ({ req }) {

    let token = req.query.token || req.headers.authorization;
  
    if (req.headers.authorization) {
      if (req.headers.authorization.toLowerCase().startsWith('bearer ')) {
        token = req.headers.authorization.slice(7);
      }
    }
  
    if (!token) {
      return { user: null };
    }
  
    try {
      const blacklistedToken = await BlacklistedToken.findOne({ token });
      if (blacklistedToken) {
        return { user: null };
      }
  
      const decoded = jwt.verify(token, secret, { maxAge: expiration });
      return { user: decoded.data };
    } catch (err) {
      return { user: null };
    }
  },

  // Generate a new JWT for a user
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    return token;
  },
};