const { fn, col, where } = require('sequelize');
const User = require('../models/User');

class UserRepository {
  // Helper to map Sequelize id to Mongoose _id for backward compatibility
  _mapUser(user) {
    if (!user) return null;
    const userData = user.toJSON();
    userData._id = userData.id; // Compatibility mapping
    return userData;
  }

  async findByEmail(email) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({
      where: where(fn('lower', col('email')), normalizedEmail)
    });
    return this._mapUser(user);
  }

  async findByUsername(username) {
    const user = await User.findOne({ where: { username } });
    return this._mapUser(user);
  }

  async findById(id) {
    const user = await User.findByPk(id);
    return this._mapUser(user);
  }

  async create(userData) {
    const data = {
      ...userData,
      email: String(userData.email).trim().toLowerCase()
    };
    const user = await User.create(data);
    return this._mapUser(user);
  }
}

module.exports = new UserRepository();
