const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  displayName: { type: String },
  avatar: { type: String },
  email: { type: String },
  githubUrl: { type: String },
  accessToken: { type: String },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  leetcodeUsername: { type: String, default: '' },
  codeforcesHandle: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);