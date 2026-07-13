import React, { useEffect, useRef, useState, createContext, useContext } from 'react'
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Kanban from './pages/KanbanNew'
import Dashboard from './pages/Dashboard'
import TimeTracking from './pages/TimeTracking'
import Reports from './pages/Reports'
import Login from './pages/Login'
import Register from './pages/Register'

// ── Theme Context ──────────────────────────────────────────────────────────────
export const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({
  dark: true,
  toggle: () => {},
})
export const useTheme = () => useContext(ThemeContext)

// ── Home Page ─────────────────────────────────────────────────────────────────
function Home() {
  const navigate = useNavigate()
  const { dark } = useTheme()
  const [currentUser, setCurrentUser] = useState<any>(null)

  React.useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) setCurrentUser(JSON.parse(user))
  }, [])

  const features = [
    {
      icon: '📊',
      title: 'Dashboard',
      description: 'Live overview of projects, tasks, and team stats fetched straight from the backend.',
      accent: dark ? '#a78bfa' : '#667eea',
      route: '/dashboard',
    },
    {
      icon: '📋',
      title: 'Kanban Board',
      description: 'Drag-and-drop cards across columns. Add, edit, delete cards and create new columns.',
      accent: dark ? '#f472b6' : '#f093fb',
      route: '/kanban',
    },
    {
      icon: '⏱️',
      title: 'Time Tracking',
      description: 'Start / stop live timers or log manual entries. Filter and review all time logs.',
      accent: dark ? '#38bdf8' : '#4facfe',
      route: '/time',
    },
    {
      icon: '📈',
      title: 'Reports',
      description: 'Task status breakdown, project progress bars, hours per member and weekly activity.',
      accent: dark ? '#34d399' : '#43e97b',
      route: '/reports',
    },
  ]

  const card = (bg: string) => ({
    background: bg,
    padding: '28px 24px',
    borderRadius: '16px',
    color: 'white',
    textAlign: 'center' as const,
    transition: 'transform 0.3s',
    cursor: 'default',
  })

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: '800',
          color: dark ? '#f1f5f9' : '#1a1f36',
          marginBottom: '20px',
          lineHeight: 1.15,
          letterSpacing: '-1px',
          textShadow: dark ? '0 0 40px rgba(167,139,250,0.3)' : 'none',
        }}>
          Project Management<br />
          <span style={{ color: dark ? '#a78bfa' : '#667eea' }}>Time Tracker</span>
        </h1>

        {!currentUser ? (
          <div style={{
            display: 'inline-flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '14px 36px',
              background: dark ? 'linear-gradient(135deg,#a78bfa,#7c3aed)' : 'linear-gradient(135deg,#667eea,#764ba2)',
              color: 'white', border: 'none', borderRadius: '10px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              boxShadow: dark ? '0 4px 20px rgba(167,139,250,0.4)' : '0 4px 20px rgba(102,126,234,0.35)',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              🚀 Get Started
            </button>
            <button onClick={() => navigate('/dashboard')} style={{
              padding: '14px 36px',
              background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(102,126,234,0.08)',
              color: dark ? 'white' : '#667eea',
              border: `2px solid ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(102,126,234,0.3)'}`,
              borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View Demo
            </button>
          </div>
        ) : (
          <p style={{ color: dark ? '#a78bfa' : '#667eea', fontWeight: '600', fontSize: '16px' }}>
            👋 Welcome back, {currentUser.fullName || currentUser.username}!
          </p>
        )}
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '16px', marginBottom: '56px' }}>
        {[
          { label: 'Active Projects', val: '3+', bg: dark ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'linear-gradient(135deg,#667eea,#764ba2)' },
          { label: 'Tasks Tracked',   val: '10+', bg: dark ? 'linear-gradient(135deg,#be185d,#f472b6)' : 'linear-gradient(135deg,#f093fb,#f5576c)' },
          { label: 'Hours Logged',    val: '26+', bg: dark ? 'linear-gradient(135deg,#0369a1,#38bdf8)' : 'linear-gradient(135deg,#4facfe,#00f2fe)' },
          { label: 'Team Members',    val: '6',   bg: dark ? 'linear-gradient(135deg,#065f46,#34d399)' : 'linear-gradient(135deg,#43e97b,#38f9d7)' },
        ].map(s => (
          <div key={s.label}
            style={card(s.bg)}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-5px)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '34px', fontWeight: '800', marginBottom: '6px' }}>{s.val}</div>
            <div style={{ fontSize: '13px', opacity: 0.9, fontWeight: '500' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Features grid ── */}
      <h2 style={{
        fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '36px',
        color: dark ? '#f1f5f9' : '#1a1f36',
      }}>
        Everything you need
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '20px', marginBottom: '56px' }}>
        {features.map((f, i) => (
          <div key={i} onClick={() => navigate(f.route)} style={{
            background: dark ? 'rgba(255,255,255,0.04)' : '#ffffff',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(102,126,234,0.15)'}`,
            borderRadius: '16px',
            padding: '32px 28px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: dark ? 'none' : '0 2px 12px rgba(102,126,234,0.07)',
          }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(-6px)'
              el.style.borderColor = f.accent
              el.style.boxShadow = `0 12px 32px ${f.accent}33`
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement
              el.style.transform = 'translateY(0)'
              el.style.borderColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(102,126,234,0.15)'
              el.style.boxShadow = dark ? 'none' : '0 2px 12px rgba(102,126,234,0.07)'
            }}
          >
            <div style={{ fontSize: '44px', marginBottom: '14px' }}>{f.icon}</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px', color: dark ? '#f1f5f9' : '#1a1f36' }}>{f.title}</h3>
            <p style={{ fontSize: '14px', color: dark ? '#94a3b8' : '#4a5276', lineHeight: 1.6 }}>{f.description}</p>
            <div style={{
              marginTop: '18px', display: 'inline-block',
              fontSize: '13px', fontWeight: '700', color: f.accent,
            }}>
              Explore →
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA banner ── */}
      <div style={{
        background: dark
          ? 'linear-gradient(135deg,rgba(124,58,237,0.6),rgba(167,139,250,0.3))'
          : 'linear-gradient(135deg,#667eea,#764ba2)',
        border: dark ? '1px solid rgba(167,139,250,0.25)' : 'none',
        borderRadius: '20px',
        padding: '48px 40px',
        textAlign: 'center',
        color: 'white',
        backdropFilter: 'blur(10px)',
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px' }}>Ready to track smarter?</h2>
        <p style={{ fontSize: '16px', opacity: 0.85, marginBottom: '28px' }}>
          Login and start managing projects efficiently today.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/dashboard')} style={{
            background: 'white', color: dark ? '#7c3aed' : '#667eea',
            border: 'none', padding: '14px 36px', borderRadius: '10px',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            View Dashboard
          </button>
          <button onClick={() => navigate('/kanban')} style={{
            background: 'rgba(255,255,255,0.15)', color: 'white',
            border: '2px solid rgba(255,255,255,0.5)', padding: '14px 36px',
            borderRadius: '10px', fontSize: '16px', fontWeight: '700',
            cursor: 'pointer', transition: 'transform 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Open Kanban
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Root App ──────────────────────────────────────────────────────────────────
function App() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const navRef    = useRef<HTMLElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const [currentUser, setCurrentUser]       = useState<any>(null)
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('pmtt-theme')
    return saved !== null ? saved === 'dark' : true   // dark by default
  })

  const toggleTheme = () =>
    setDark(prev => {
      const next = !prev
      localStorage.setItem('pmtt-theme', next ? 'dark' : 'light')
      return next
    })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) setCurrentUser(JSON.parse(user))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('currentUser')
    setCurrentUser(null)
    navigate('/login')
  }

  useEffect(() => {
    const update = () => {
      if (!navRef.current) return
      const active = navRef.current.querySelector('a.active') as HTMLElement | null
      if (active) setIndicatorStyle({ left: active.offsetLeft, width: active.offsetWidth })
    }
    update()
    setTimeout(update, 10)
  }, [location])

  // ── theme tokens ──
  const nav = {
    bg:     dark ? 'rgba(10,10,15,0.92)'   : 'rgba(255,255,255,0.96)',
    border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.07)',
    link:   dark ? '#c4b5fd' : '#667eea',
    active: dark ? '#a78bfa' : '#5568e0',
    activeBg: dark ? 'rgba(167,139,250,0.15)' : 'rgba(102,126,234,0.12)',
    indicator: dark ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : 'linear-gradient(90deg,#667eea,#764ba2)',
  }

  return (
    <ThemeContext.Provider value={{ dark, toggle: toggleTheme }}>
      <div className="app" data-theme={dark ? 'dark' : 'light'}>

        {location.pathname !== '/login' && location.pathname !== '/register' && (
          <nav ref={navRef} style={{
            background: nav.bg,
            backdropFilter: 'blur(16px)',
            borderBottom: nav.border,
            boxShadow: dark ? '0 1px 0 rgba(255,255,255,0.04)' : '0 2px 10px rgba(0,0,0,0.08)',
          }}>
            {/* Brand */}
            <span style={{
              fontWeight: '800', fontSize: '15px',
              color: dark ? '#a78bfa' : '#667eea',
              letterSpacing: '-0.3px', whiteSpace: 'nowrap', marginRight: '8px',
            }}>
              ⏱ PM Tracker
            </span>

            <NavLink to="/"         end className={({ isActive }) => isActive ? 'active' : ''}>🏠 Home</NavLink>
            <NavLink to="/dashboard"    className={({ isActive }) => isActive ? 'active' : ''}>📊 Dashboard</NavLink>
            <NavLink to="/kanban"       className={({ isActive }) => isActive ? 'active' : ''}>📋 Kanban</NavLink>
            <NavLink to="/time"         className={({ isActive }) => isActive ? 'active' : ''}>⏱️ Time</NavLink>
            <NavLink to="/reports"      className={({ isActive }) => isActive ? 'active' : ''}>📈 Reports</NavLink>

            {/* Right side */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Theme toggle */}
              <button onClick={toggleTheme} title={dark ? 'Switch to Light' : 'Switch to Dark'} style={{
                background: dark ? 'rgba(167,139,250,0.12)' : 'rgba(102,126,234,0.1)',
                border: `1px solid ${dark ? 'rgba(167,139,250,0.25)' : 'rgba(102,126,234,0.2)'}`,
                borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                fontSize: '16px', transition: 'all 0.2s',
                color: dark ? '#a78bfa' : '#667eea',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {dark ? '☀️' : '🌙'}
              </button>

              {currentUser ? (
                <>
                  <span style={{
                    fontSize: '13px', fontWeight: '600',
                    color: dark ? '#c4b5fd' : '#667eea',
                    padding: '6px 10px',
                    background: dark ? 'rgba(167,139,250,0.08)' : 'rgba(102,126,234,0.07)',
                    borderRadius: '8px',
                  }}>
                    👤 {currentUser.fullName || currentUser.username}
                  </span>
                  <button onClick={handleLogout} style={{
                    padding: '7px 14px',
                    background: dark ? 'rgba(239,68,68,0.15)' : '#fee2e2',
                    border: `1px solid ${dark ? 'rgba(239,68,68,0.3)' : '#fca5a5'}`,
                    borderRadius: '7px', color: dark ? '#f87171' : '#dc2626',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" style={{
                  padding: '7px 16px',
                  background: dark ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : 'linear-gradient(135deg,#667eea,#764ba2)',
                  color: 'white', borderRadius: '8px', fontWeight: '700', fontSize: '13px',
                  textDecoration: 'none',
                }}>
                  🔐 Login
                </NavLink>
              )}
            </div>

            <div className="nav-indicator" style={{
              background: nav.indicator,
              transform: `translateX(${indicatorStyle.left}px)`,
              width: `${indicatorStyle.width}px`,
            }} />
          </nav>
        )}

        <main>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/kanban"    element={<Kanban />} />
            <Route path="/time"      element={<TimeTracking />} />
            <Route path="/reports"   element={<Reports />} />
            <Route path="/login"     element={<Login onLoginSuccess={u => setCurrentUser(u)} />} />
            <Route path="/register"  element={<Register onLoginSuccess={u => setCurrentUser(u)} />} />
          </Routes>
        </main>
      </div>
    </ThemeContext.Provider>
  )
}

export default App
