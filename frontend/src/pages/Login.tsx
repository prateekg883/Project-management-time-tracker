import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import api from '../services/client'

interface LoginProps {
  onLoginSuccess?: (user: any) => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const { dark, toggle } = useTheme()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await api.post('/auth/login', { username, password })
      localStorage.setItem('user',        JSON.stringify(response.data))
      localStorage.setItem('currentUser', JSON.stringify(response.data))
      if (onLoginSuccess) onLoginSuccess(response.data)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const bg = dark
    ? 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35) 0%, transparent 70%), #080a0f'
    : 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)'

  const card = {
    background:   dark ? '#0e1117' : '#ffffff',
    border:       dark ? '1px solid rgba(255,255,255,0.07)' : 'none',
    borderRadius: '20px',
    padding:      '44px 40px',
    boxShadow:    dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 20px 60px rgba(0,0,0,0.25)',
    width: '100%',
    maxWidth: '440px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px',
    background: dark ? '#131720' : '#f9fafb',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
    borderRadius: '8px', fontSize: '15px',
    color: dark ? '#f1f5f9' : '#1e293b',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, position: 'relative', padding: '20px' }}>

      {/* Theme toggle */}
      <button onClick={toggle} title="Toggle theme" style={{
        position: 'absolute', top: '20px', right: '20px',
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '18px',
        color: 'white', transition: 'transform 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Back button */}
      <button onClick={() => navigate('/')} style={{
        position: 'absolute', top: '20px', left: '20px',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '10px', color: 'white', padding: '10px 20px',
        cursor: 'pointer', fontSize: '14px', fontWeight: '600',
        transition: 'all 0.2s', backdropFilter: 'blur(10px)',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateX(-3px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)';  e.currentTarget.style.transform = 'translateX(0)' }}
      >
        ← Back
      </button>

      <div style={card}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏱️</div>
          <h1 style={{
            fontSize: '22px', fontWeight: '800',
            color: dark ? '#a78bfa' : '#667eea',
            marginBottom: '6px', lineHeight: 1.2,
          }}>
            Project Management<br />Time Tracker
          </h1>
          <p style={{ color: dark ? '#64748b' : '#6b7280', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        {/* Demo credentials */}
        <div style={{
          background: dark ? 'rgba(167,139,250,0.06)' : '#f3f4f6',
          border: `1px solid ${dark ? 'rgba(167,139,250,0.15)' : '#e5e7eb'}`,
          padding: '14px', borderRadius: '10px', marginBottom: '26px',
          fontSize: '12px', color: dark ? '#94a3b8' : '#4b5563',
        }}>
          <strong style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: dark ? '#c4b5fd' : '#374151' }}>
            Demo Accounts:
          </strong>
          <div style={{ display: 'grid', gap: '5px' }}>
            {[
              ['👨‍💼 Admin',   'admin / admin123'],
              ['👨‍💼 Admin',   'alice / alice123'],
              ['📋 Manager', 'charlie / charlie123'],
              ['📋 Manager', 'pm1 / pm123'],
              ['👤 Member',  'bob / bob123'],
              ['👤 Member',  'dev1 / dev123'],
            ].map(([role, creds]) => (
              <div key={creds}>
                <strong>{role}:</strong>{' '}
                <code style={{
                  background: dark ? 'rgba(255,255,255,0.06)' : 'white',
                  border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
                  padding: '1px 6px', borderRadius: '4px', fontSize: '11px',
                  color: dark ? '#a78bfa' : '#374151',
                }}>
                  {creds}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: dark ? '#94a3b8' : '#374151' }}>
              Username
            </label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)}
              required placeholder="Enter username"
              style={inputStyle}
              onFocus={e  => { e.target.style.borderColor = dark ? '#a78bfa' : '#667eea'; e.target.style.boxShadow = `0 0 0 3px ${dark ? 'rgba(167,139,250,0.15)' : 'rgba(102,126,234,0.12)'}` }}
              onBlur={e   => { e.target.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '13px', color: dark ? '#94a3b8' : '#374151' }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required placeholder="Enter password"
              style={inputStyle}
              onFocus={e  => { e.target.style.borderColor = dark ? '#a78bfa' : '#667eea'; e.target.style.boxShadow = `0 0 0 3px ${dark ? 'rgba(167,139,250,0.15)' : 'rgba(102,126,234,0.12)'}` }}
              onBlur={e   => { e.target.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {error && (
            <div style={{
              background: dark ? 'rgba(239,68,68,0.1)' : '#fee2e2',
              border: `1px solid ${dark ? 'rgba(239,68,68,0.25)' : '#fca5a5'}`,
              color: dark ? '#f87171' : '#dc2626',
              padding: '10px 14px', borderRadius: '8px', marginBottom: '18px', fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading
              ? (dark ? '#2d2d3a' : '#9ca3af')
              : (dark ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'linear-gradient(135deg,#667eea,#764ba2)'),
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'transform 0.2s, opacity 0.2s', marginBottom: '16px',
            boxShadow: loading ? 'none' : dark ? '0 4px 20px rgba(124,58,237,0.4)' : '0 4px 20px rgba(102,126,234,0.35)',
          }}
            onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button type="button" onClick={() => navigate('/')} style={{
              background: 'none', border: 'none',
              color: dark ? '#7c3aed' : '#667eea',
              cursor: 'pointer', fontSize: '13px', textDecoration: 'underline',
            }}>
              Continue as Guest
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <span style={{ fontSize: '14px', color: dark ? '#64748b' : '#6b7280' }}>
              Don't have an account?{' '}
            </span>
            <button type="button" onClick={() => navigate('/register')} style={{
              background: 'none', border: 'none',
              color: dark ? '#a78bfa' : '#667eea',
              cursor: 'pointer', fontSize: '14px',
              fontWeight: '700', textDecoration: 'underline',
            }}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
