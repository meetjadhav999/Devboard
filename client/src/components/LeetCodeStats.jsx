import { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from './StatCard'

export default function LeetCodeStats({ username }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return setLoading(false)
    axios.get(`http://localhost:5000/api/leetcode/stats/${username}`, {
      withCredentials: true
    })
      .then(res => setStats(res.data))
      .catch(() => setError('Could not load LeetCode stats'))
      .finally(() => setLoading(false))
  }, [username])

  if (!username) return (
    <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '10px', fontSize: '13px', color: '#92400e' }}>
      Add your LeetCode username in Settings to see stats
    </div>
  )
  if (loading) return <div style={{ color: '#999', fontSize: '13px' }}>Loading LeetCode stats...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '13px' }}>{error}</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '15px' }}>LeetCode</h3>
        {stats.fromCache && (
          <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px' }}>
            cached
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
        <StatCard label="Total solved" value={stats.solved.total} />
        <StatCard label="Easy" value={stats.solved.easy} />
        <StatCard label="Medium" value={stats.solved.medium} />
        <StatCard label="Hard" value={stats.solved.hard} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '10px' }}>
        <StatCard label="Contest rating" value={stats.contest.rating || '—'} />
        <StatCard label="Contests attended" value={stats.contest.attended} />
      </div>
      <div style={{ fontSize: '11px', color: '#999', marginTop: '8px', textAlign: 'right' }}>
        Fetch time: {stats.fetchTime}ms
      </div>
    </div>
  )
}