import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [leetcodeUsername, setLeetcodeUsername] = useState(user?.leetcodeUsername || '')
  const [codeforcesHandle, setCodeforcesHandle] = useState(user?.codeforcesHandle || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await axios.put('http://localhost:5000/auth/update-profile',
        { leetcodeUsername, codeforcesHandle },
        { withCredentials: true }
      )
      setUser(res.data.user)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      alert('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #ddd', fontSize: '14px', marginTop: '6px',
    outline: 'none', fontFamily: 'sans-serif'
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: '1px solid #ddd', borderRadius: '8px',
          padding: '6px 12px', cursor: 'pointer', fontSize: '13px'
        }}>← Back</button>
        <h2 style={{ margin: 0 }}>Settings</h2>
      </div>

      <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '15px' }}>Connected platforms</h3>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>
            LeetCode username
          </label>
          <input
            style={inputStyle}
            value={leetcodeUsername}
            onChange={e => setLeetcodeUsername(e.target.value)}
            placeholder="e.g. meet999"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>
            Codeforces handle
          </label>
          <input
            style={inputStyle}
            value={codeforcesHandle}
            onChange={e => setCodeforcesHandle(e.target.value)}
            placeholder="e.g. meet_cf"
          />
        </div>

        <button onClick={save} disabled={saving} style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          background: saved ? '#22c55e' : '#24292e', color: 'white',
          border: 'none', fontSize: '14px', fontWeight: '500',
          cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.2s'
        }}>
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}