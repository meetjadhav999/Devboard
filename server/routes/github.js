const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.get('/profile', auth, async (req, res) => {
  try {
    const response = await fetch(`https://api.github.com/users/${req.user.username}`, {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error' });
  }
});

router.get('/repos', auth, async (req, res) => {
  try {
    const fullUser = await User.findById(req.user._id);
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=10', {
      headers: {
        Authorization: `Bearer ${fullUser.accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'GitHub API error' });
  }
});

module.exports = router;