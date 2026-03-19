import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import LeetCodeStats from '../components/LeetCodeStats'
import CodeforcesStats from '../components/CodeforcesStats'

export default function Dashboard() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
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

  const sectionStyle = {
    background: 'white', border: '1px solid #eee',
    borderRadius: '12px', padding: '1.5rem', marginBottom: '1.2rem'
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={user.avatar} alt="avatar" style={{ width: '44px', borderRadius: '50%' }} />
          <div>
            <div style={{ fontWeight: '600', fontSize: '16px' }}>{user.displayName}</div>
            <div style={{ color: '#666', fontSize: '13px' }}>@{user.username}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => navigate('/settings')} style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd',
            cursor: 'pointer', background: 'white', fontSize: '13px'
          }}>Settings</button>
          <button onClick={logout} style={{
            padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd',
            cursor: 'pointer', background: 'white', fontSize: '13px'
          }}>Logout</button>
        </div>
      </div>

      {profile && (
        <div style={sectionStyle}>
          <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>GitHub</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Public repos', value: profile.public_repos },
              { label: 'Followers', value: profile.followers },
              { label: 'Following', value: profile.following }
            ].map(stat => (
              <div key={stat.label} style={{
                background: '#f3f4f6', borderRadius: '10px',
                padding: '1rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '600' }}>{stat.value}</div>
                <div style={{ color: '#666', fontSize: '13px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={sectionStyle}>
        <LeetCodeStats username={user.leetcodeUsername} />
      </div>

      <div style={sectionStyle}>
        <CodeforcesStats handle={user.codeforcesHandle} />
      </div>

      <div style={sectionStyle}>
        <h3 style={{ margin: '0 0 12px', fontSize: '15px' }}>Recent repositories</h3>
        {repos.map(repo => (
          <div key={repo.id} style={{
            borderBottom: '1px solid #f3f3f3', paddingBottom: '12px', marginBottom: '12px'
          }}>
            <a href={repo.html_url} target="_blank" rel="noreferrer"
              style={{ fontWeight: '500', color: '#0070f3', textDecoration: 'none', fontSize: '14px' }}>
              {repo.name}
            </a>
            <p style={{ margin: '4px 0 0', color: '#666', fontSize: '13px' }}>
              {repo.description || 'No description'}
            </p>
            <div style={{ marginTop: '6px', fontSize: '12px', color: '#999' }}>
              Stars: {repo.stargazers_count} · Language: {repo.language || 'N/A'}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}