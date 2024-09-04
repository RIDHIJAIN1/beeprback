const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const config = require('../config/config'); // Adjust the path to your config file

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is in the format "Bearer <token>"

  // If no token is provided, return an unauthorized error
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).send({ message: 'No token provided.' });
  }
 
  // Verify the token using the secret from the config
  jwt.verify(token, config.jwt.secret, (err, decoded) => {
    if (err) {
      // Log the error for debugging purposes
      console.error('Token verification error:', err);
      return res.status(httpStatus.UNAUTHORIZED).send({ message: 'Failed to authenticate token.' });
    }

    // Attach the userId from the decoded token to the request object
    req.userId = decoded.sub; // Assuming the payload has a field named "id"
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authMiddleware;