const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

router.get('/github', passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login-failed' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

router.get('/me', require('../middleware/auth'), (req, res) => {
  res.json({ user: req.user });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;