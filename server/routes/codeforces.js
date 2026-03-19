const router = require('express').Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const redis = require('../config/redis');

router.get('/stats/:handle', auth, async (req, res) => {
  const { handle } = req.params;
  const cacheKey = `codeforces:${handle}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('Cache HIT — codeforces', handle);
      return res.json({ ...JSON.parse(cached), fromCache: true });
    }

    console.log('Cache MISS — fetching codeforces', handle);
    const start = Date.now();

    const [userRes, ratingRes] = await Promise.all([
      axios.get(`https://codeforces.com/api/user.info?handles=${handle}`),
      axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`)
    ]);

    const user = userRes.data.result[0];
    const ratingHistory = ratingRes.data.result;
    const elapsed = Date.now() - start;

    const result = {
      handle,
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      rank: user.rank || 'unrated',
      maxRank: user.maxRank || 'unrated',
      avatar: user.avatar,
      contestsAttended: ratingHistory.length,
      ratingHistory: ratingHistory.slice(-10).map(r => ({
        contestName: r.contestName,
        rating: r.newRating,
        date: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString()
      })),
      fetchTime: elapsed
    };

    await redis.setex(cacheKey, 3600, JSON.stringify(result));
    res.json({ ...result, fromCache: false });

  } catch (err) {
    console.error('Codeforces API error:', err.message);
    res.status(500).json({ message: 'Failed to fetch Codeforces stats' });
  }
});

module.exports = router;