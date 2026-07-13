import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import api from '../services/client'

interface RegisterProps {
  onLoginSuccess?: (user: any) => void
}

const ROLES = [
  { value: 'TEAM_MEMBER',     label: '👤 Team Member' },
  { value: 'PROJECT_MANAGER', label: '📋 Project Manager' },
  { value: 'ADMIN',           label: '👨‍💼 Admin' },
]

export default function Register({ onLoginSuccess }: RegisterProps) {
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '',
    fullName: '', email: '', role: 'TEAM_MEMBER',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters')
      return
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        username: form.username,
        password: form.password,
        fullName: form.fullName,
        email:    form.email,
        role:     form.role,
      })
      localStorage.setItem('user',        JSON.stringify(res.data))
      localStorage.setItem('currentUser', JSON.stringify(res.data))
      if (onLoginSuccess) onLoginSuccess(res.data)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const bg = dark
    ? 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.35) 0%, transparent 70%), #080a0f'
    : 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)'

  const card: React.CSSProperties = {
    background:   dark ? '#0e1117' : '#ffffff',
    border:       dark ? '1px solid rgba(255,255,255,0.07)' : 'none',
    borderRadius: '20px',
    padding:      '40px',
    boxShadow:    dark ? '0 24px 64px rgba(0,0,0,0.7)' : '0 20px 60px rgba(0,0,0,0.25)',
    width: '100%',
    maxWidth: '460px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: dark ? '#131720' : '#f9fafb',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
    borderRadius: '8px', fontSize: '15px',
    color: dark ? '#f1f5f9' : '#1e293b',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit', boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px',
    fontWeight: '600', fontSize: '13px',
    color: dark ? '#94a3b8' : '#374151',
  }

  const focusIn  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = dark ? '#a78bfa' : '#667eea'
    e.target.style.boxShadow   = `0 0 0 3px ${dark ? 'rgba(167,139,250,0.15)' : 'rgba(102,126,234,0.12)'}`
  }
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
    e.target.style.boxShadow   = 'none'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, position: 'relative', padding: '20px' }}>

      {/* Theme toggle */}
      <button onClick={toggle} title="Toggle theme" style={{
        position: 'absolute', top: '20px', right: '20px',
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '18px',
        color: 'white',
      }}>
        {dark ? '☀️' : '🌙'}
      </button>

      {/* Back */}
      <button onClick={() => navigate('/login')} style={{
        position: 'absolute', top: '20px', left: '20px',
        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: '10px', color: 'white', padding: '10px 20px',
        cursor: 'pointer', fontSize: '14px', fontWeight: '600',
      }}>
        ← Back to Login
      </button>

      <div style={card}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '30px', marginBottom: '10px' }}>⏱️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: dark ? '#a78bfa' : '#667eea', marginBottom: '6px' }}>
            Create Account
          </h1>
          <p style={{ color: dark ? '#64748b' : '#6b7280', fontSize: '14px' }}>
            Join Project Management Time Tracker
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" placeholder="John Doe"
              value={form.fullName} onChange={e => set('fullName', e.target.value)}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          {/* Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Username <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="text" placeholder="johndoe" required
              value={form.username} onChange={e => set('username', e.target.value)}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="john@example.com"
              value={form.email} onChange={e => set('email', e.target.value)}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Role <span style={{ color: '#ef4444' }}>*</span></label>
            <select value={form.role} onChange={e => set('role', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={focusIn} onBlur={focusOut}
            >
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="password" placeholder="Min 4 characters" required
              value={form.password} onChange={e => set('password', e.target.value)}
              style={inputStyle} onFocus={focusIn} onBlur={focusOut}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '22px' }}>
            <label style={labelStyle}>Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
            <input type="password" placeholder="Repeat password" required
              value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: form.confirmPassword && form.password !== form.confirmPassword
                  ? '#ef4444' : (dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb')
              }}
              onFocus={focusIn} onBlur={focusOut}
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>Passwords do not match</p>
            )}
          </div>

          {/* Error */}
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

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading
              ? (dark ? '#2d2d3a' : '#9ca3af')
              : (dark ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'linear-gradient(135deg,#667eea,#764ba2)'),
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
            boxShadow: loading ? 'none' : dark ? '0 4px 20px rgba(124,58,237,0.4)' : '0 4px 20px rgba(102,126,234,0.35)',
          }}>
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>

          {/* Link to login */}
          <p style={{ textAlign: 'center', fontSize: '14px', color: dark ? '#64748b' : '#6b7280' }}>
            Already have an account?{' '}
            <button type="button" onClick={() => navigate('/login')} style={{
              background: 'none', border: 'none',
              color: dark ? '#a78bfa' : '#667eea',
              cursor: 'pointer', fontSize: '14px',
              fontWeight: '700', textDecoration: 'underline',
            }}>
              Sign In
            </button>
          </p>

        </form>
      </div>
    </div>
  )
}
