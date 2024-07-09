const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Adjust the path based on your user model

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Admin.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' }); // More specific error
    }

    req.token = token;
    req.user = user;
    next();

  } catch (error) {
    // Log the error for debugging
    console.error('Authentication error:', error.message);

    // Differentiate between token expiration and other errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }
};


module.exports = authMiddleware;
