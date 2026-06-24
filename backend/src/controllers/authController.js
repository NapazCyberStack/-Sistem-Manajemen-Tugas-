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

  // Register User — POST /register
  register = async (req, res, next) => {
    try {
      const { username, email, password, role } = req.body;

      const userExistsByEmail = await userRepository.findByEmail(email);
      if (userExistsByEmail) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      const userExistsByUsername = await userRepository.findByUsername(username);
      if (userExistsByUsername) {
        return res.status(400).json({ message: 'Username sudah digunakan' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await userRepository.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'User'
      });

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

  // Login User — POST /login
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email atau password salah' });
      }

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

  // Get Profile — GET /me (protected)
  getProfile = async (req, res, next) => {
    try {
      const user = await userRepository.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });
      return res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (error) {
      next(error);
    }
  };

  // Logout — POST /logout
  logout = (req, res) => {
    return res.json({ message: 'Logout berhasil' });
  };
}

module.exports = new AuthController();
