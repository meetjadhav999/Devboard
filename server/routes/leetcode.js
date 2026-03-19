const router = require('express').Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const redis = require('../config/redis');

router.get('/stats/:username', auth, async (req, res) => {
  const { username } = req.params;
  const cacheKey = `leetcode:${username}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('Cache HIT — leetcode', username);
      return res.json({ ...JSON.parse(cached), fromCache: true });
    }

    console.log('Cache MISS — fetching leetcode', username);
    const start = Date.now();

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile { ranking realName }
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
        userContestRanking(username: $username) {
          rating
          globalRanking
          totalParticipants
          attendedContestsCount
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', {
      query,
      variables: { username }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      }
    });

    const data = response.data.data;
    const elapsed = Date.now() - start;

    const result = {
      username,
      ranking: data.matchedUser?.profile?.ranking,
      solved: {
        easy: data.matchedUser?.submitStats?.acSubmissionNum?.find(d => d.difficulty === 'Easy')?.count || 0,
        medium: data.matchedUser?.submitStats?.acSubmissionNum?.find(d => d.difficulty === 'Medium')?.count || 0,
        hard: data.matchedUser?.submitStats?.acSubmissionNum?.find(d => d.difficulty === 'Hard')?.count || 0,
        total: data.matchedUser?.submitStats?.acSubmissionNum?.find(d => d.difficulty === 'All')?.count || 0,
      },
      contest: {
        rating: Math.round(data.userContestRanking?.rating || 0),
        globalRanking: data.userContestRanking?.globalRanking,
        attended: data.userContestRanking?.attendedContestsCount || 0
      },
      fetchTime: elapsed
    };

    await redis.setex(cacheKey, 3600, JSON.stringify(result));
    res.json({ ...result, fromCache: false });

  } catch (err) {
    console.error('LeetCode API error:', err.message);
    res.status(500).json({ message: 'Failed to fetch LeetCode stats' });
  }
});

module.exports = router;