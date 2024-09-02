// middlewares.js

const jwt = require('jsonwebtoken');
const config = require('../configs/config');

// Middleware to log request details
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Middleware to authenticate JWT tokens
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = decoded; // Attach user info to request
    next();
  });
};

// Middleware to handle errors
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
};

const authentication = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer header

  console.log(token)
  if (!token) {
    
    return res.status(400).send({
      is_error: true,
      message: 'sorry, You have no token',
    })
  } else {
    const varify = jwt.verify(token, "werfa324rfaew32ra")
    
    if (varify) {
      req.id = varify
      next()
    } else {
     
      return res.status(200).send({
        is_error: true,
        message: 'something went wrong',
      })
    }
  }
}
module.exports = {
  requestLogger,
  authenticate,
  errorHandler,
  authentication
};




