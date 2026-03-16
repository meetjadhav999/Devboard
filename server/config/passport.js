const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/github/callback',
  scope: ['user:email', 'read:user', 'repo']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });

    if (user) {
      user.accessToken = accessToken;
      await user.save();
      return done(null, user);
    }

    user = await User.create({
      githubId: profile.id,
      username: profile.username,
      displayName: profile.displayName || profile.username,
      avatar: profile.photos?.[0]?.value,
      email: profile.emails?.[0]?.value,
      githubUrl: profile.profileUrl,
      accessToken
    });

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));