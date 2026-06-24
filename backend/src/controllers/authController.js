const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class AuthController {
  // Helper to generate JWT token
  _generateToken(id) {
    return jwt.sign(
      { id }, 
      process.env.JWT_SECRET || 'supersecretjwtkey12345!', 
      { expiresIn: '30d' }
    );
  }

  // Register User
  // POST /register
  register = async (req, res, next) => {
    try {
      const { username, email, password, role } = req.body;

      // Check if user already exists (by email)
      const userExistsByEmail = await userRepository.findByEmail(email);
      if (userExistsByEmail) {
        return res.status(400).json({ message: 'A user with this email already exists' });
      }

      // Check if user already exists (by username)
      const userExistsByUsername = await userRepository.findByUsername(username);
      if (userExistsByUsername) {
        return res.status(400).json({ message: 'Username is already taken' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Determine user role (defaults to User, but can be set to Admin)
      const userRole = role || 'User';

      // Save user
      const user = await userRepository.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: userRole
      });

      // Send response
      return res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: this._generateToken(user._id)
      });
    } catch (error) {
      next(error);
    }
  };

  // Login User
  // POST /login
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Match password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Send response
      return res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: this._generateToken(user._id)
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
