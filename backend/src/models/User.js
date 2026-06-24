const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username wajib diisi'],
      unique: true,
      trim: true,
      minlength: [3, 'Username minimal 3 karakter'],
      maxlength: [30, 'Username maksimal 30 karakter']
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid']
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      minlength: [6, 'Password minimal 6 karakter']
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    }
  },
  { timestamps: true }
);

// Index untuk performa query
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

module.exports = mongoose.model('User', UserSchema);
