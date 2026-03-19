import { useEffect, useState } from 'react'
import axios from 'axios'
import StatCard from './StatCard'

export default function CodeforcesStats({ handle }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!handle) return setLoading(false)
    axios.get(`http://localhost:5000/api/codeforces/stats/${handle}`, {
      withCredentials: true
    })
      .then(res => setStats(res.data))
      .catch(() => setError('Could not load Codeforces stats'))
      .finally(() => setLoading(false))
  }, [handle])

  if (!handle) return (
    <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '10px', fontSize: '13px', color: '#92400e' }}>
      Add your Codeforces handle in Settings to see stats
    </div>
  )
  if (loading) return <div style={{ color: '#999', fontSize: '13px' }}>Loading Codeforces stats...</div>
  if (error) return <div style={{ color: '#ef4444', fontSize: '13px' }}>{error}</div>

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '15px' }}>Codeforces</h3>
        {stats.fromCache && (
          <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '999px' }}>
            cached
          </span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <StatCard label="Current rating" value={stats.rating} sub={stats.rank} />
        <StatCard label="Max rating" value={stats.maxRating} sub={stats.maxRank} />
        <StatCard label="Contests" value={stats.contestsAttended} />
      </div>
      <div style={{ fontSize: '11px', color: '#999', marginTop: '8px', textAlign: 'right' }}>
        Fetch time: {stats.fetchTime}ms
      </div>
    </div>
  )
}