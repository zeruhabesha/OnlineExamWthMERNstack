



const Admin = require('../models/Admin'); // Adjust the path if needed

const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming the user ID is stored in req.user after authentication

    // Fetch the user from the database
    const user = await Admin.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // User is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error in adminMiddleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = adminMiddleware;

