import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const [repos, setRepos] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:5000/api/github/profile', { withCredentials: true })
      .then(res => setProfile(res.data))

    axios.get('http://localhost:5000/api/github/repos', { withCredentials: true })
      .then(res => setRepos(res.data))
  }, [])

  const logout = () => {
    axios.get('http://localhost:5000/auth/logout', { withCredentials: true })
      .then(() => setUser(null))
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={user.avatar} alt="avatar" style={{ width: '48px', borderRadius: '50%' }} />
          <div>
            <h2 style={{ margin: 0 }}>{user.displayName}</h2>
            <p style={{ margin: 0, color: '#666' }}>@{user.username}</p>
          </div>
        </div>
        <button onClick={logout} style={{
          padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd',
          cursor: 'pointer', background: 'white'
        }}>Logout</button>
      </div>

      {profile && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '2rem' }}>
          {[
            { label: 'Public Repos', value: profile.public_repos },
            { label: 'Followers', value: profile.followers },
            { label: 'Following', value: profile.following }
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#f3f3f3', borderRadius: '10px',
              padding: '1rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{stat.value}</div>
              <div style={{ color: '#666', fontSize: '13px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <h3>Recent Repositories</h3>
      {repos.map(repo => (
        <div key={repo.id} style={{
          border: '1px solid #eee', borderRadius: '8px',
          padding: '1rem', marginBottom: '10px'
        }}>
          <a href={repo.html_url} target="_blank" rel="noreferrer"
            style={{ fontWeight: '500', color: '#0070f3', textDecoration: 'none' }}>
            {repo.name}
          </a>
          <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>
            {repo.description || 'No description'}
          </p>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
            Stars: {repo.stargazers_count} · Language: {repo.language || 'N/A'}
          </div>
        </div>
      ))}
    </div>
  )
}