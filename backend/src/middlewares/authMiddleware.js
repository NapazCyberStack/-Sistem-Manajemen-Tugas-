const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey12345!');

      // Get user from database, exclude password
      const user = await userRepository.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Format user object cleanly
      req.user = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role || 'User'
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Forbidden: User role '${req.user?.role || 'Guest'}' is not authorized to access this resource` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
