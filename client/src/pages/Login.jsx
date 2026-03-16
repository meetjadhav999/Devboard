import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function Login() {
  const { user, loading } = useAuth()

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (user) return <Navigate to="/dashboard" />

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'sans-serif', background: '#f9f9f9'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>DevBoard</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Your developer stats in one place
      </p>
      <a href="http://localhost:5000/auth/github" style={{
        background: '#24292e', color: 'white', padding: '12px 28px',
        borderRadius: '8px', textDecoration: 'none', fontSize: '15px',
        fontWeight: '500'
      }}>
        Sign in with GitHub
      </a>
    </div>
  )
}