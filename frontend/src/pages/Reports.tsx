import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../App'
import api from '../services/client'

interface DashboardReport {
  totalProjects: number; totalTasks: number; totalUsers: number; totalHoursLogged: number
  taskStatusBreakdown: Record<string,number>; projectStatusBreakdown: Record<string,number>
}
interface ProjectProgressReport {
  projects: Array<{ id:number; title:string; progress:number; status:string }>
  averageProgress: number
}
interface TimeTrackingReport {
  hoursByUser: Record<string,number>; hoursByDate: Record<string,number>; totalHours: number
}

export default function Reports() {
  const { dark } = useTheme()
  const navigate = useNavigate()
  const [dashboardReport, setDashboardReport] = useState<DashboardReport|null>(null)
  const [projectReport,   setProjectReport]   = useState<ProjectProgressReport|null>(null)
  const [timeReport,      setTimeReport]      = useState<TimeTrackingReport|null>(null)
  const [currentUser,     setCurrentUser]     = useState<any>(null)
  const [loading,         setLoading]         = useState(true)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setCurrentUser(JSON.parse(u))
  }, [])

  useEffect(() => { loadReports() }, [])

  const loadReports = async () => {
    try {
      const [d, p, t] = await Promise.all([api.get('/reports/dashboard'), api.get('/reports/project-progress'), api.get('/reports/time-tracking')])
      setDashboardReport(d.data); setProjectReport(p.data); setTimeReport(t.data)
    } catch(e) { console.error(e) } finally { setLoading(false) }
  }

  if (loading) return <div className="loading">Loading reports…</div>

  const STATUS_CLR: Record<string,string> = {
    'To Do':'#ef4444','In Progress':'#3b82f6','Completed':'#10b981','Blocked':'#f59e0b',
    'ACTIVE':'#10b981','COMPLETED':'#6366f1','ON_HOLD':'#f59e0b','CANCELLED':'#ef4444',
  }
  const color = (s: string) => STATUS_CLR[s] || '#9ca3af'

  // panel card style
  const panel: React.CSSProperties = {
    background: dark ? '#131720' : 'white',
    border:     `1px solid ${dark?'rgba(255,255,255,0.07)':'#e5e7eb'}`,
    padding:    '22px', borderRadius:'14px',
    boxShadow:  dark?'0 4px 20px rgba(0,0,0,0.5)':'0 2px 8px rgba(0,0,0,0.07)',
  }
  const barTrack: React.CSSProperties = {
    width:'100%', height:'8px',
    background: dark?'rgba(255,255,255,0.08)':'#e5e7eb',
    borderRadius:'4px', overflow:'hidden',
  }
  const labelClr = dark ? '#94a3b8' : '#6b7280'
  const titleClr = dark ? '#f1f5f9' : '#1f2937'
  const badgeBg  = dark ? 'rgba(167,139,250,0.12)' : '#f3f4f6'
  const badgeTx  = dark ? '#c4b5fd' : '#667eea'

  return (
    <div className="dashboard" style={{ position:'relative' }}>

      {/* Lock overlay for guests */}
      {!currentUser && (
        <div style={{
          position:'absolute', inset:0,
          backdropFilter:'blur(10px)',
          background: dark?'rgba(8,10,15,0.75)':'rgba(255,255,255,0.7)',
          zIndex:10, display:'flex', alignItems:'center', justifyContent:'center',
          borderRadius:'18px',
        }}>
          <div style={{
            background: dark?'#0e1117':'white',
            border:`1px solid ${dark?'rgba(255,255,255,0.08)':'#e5e7eb'}`,
            padding:'44px 40px', borderRadius:'20px',
            boxShadow:'0 20px 60px rgba(0,0,0,0.5)',
            textAlign:'center', maxWidth:'420px',
          }}>
            <div style={{ fontSize:'56px', marginBottom:'16px' }}>🔒</div>
            <h2 style={{ marginBottom:'12px', color: dark?'#a78bfa':'#667eea', fontSize:'22px' }}>Reports Restricted</h2>
            <p style={{ color:labelClr, marginBottom:'24px', fontSize:'15px', lineHeight:1.6 }}>
              Please login to view detailed reports and analytics.
            </p>
            <button onClick={() => navigate('/login')} className="btn btn-primary" style={{ fontSize:'15px', padding:'12px 32px' }}>
              Login Now →
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
        <h2>📊 Reports & Analytics</h2>
        {currentUser && (
          <span style={{ padding:'7px 14px', background:badgeBg, borderRadius:'8px', fontSize:'13px', color:badgeTx, fontWeight:'600' }}>
            {currentUser.fullName}
          </span>
        )}
      </div>

      {/* Summary stat cards */}
      {dashboardReport && (
        <div className="stats-grid" style={{ marginBottom:'32px' }}>
          <div className="stat-card"><h3>Total Projects</h3><div className="value">{dashboardReport.totalProjects}</div></div>
          <div className="stat-card"><h3>Total Tasks</h3><div className="value">{dashboardReport.totalTasks}</div></div>
          <div className="stat-card"><h3>Hours Logged</h3><div className="value">{dashboardReport.totalHoursLogged.toFixed(1)}</div></div>
          <div className="stat-card"><h3>Team Members</h3><div className="value">{dashboardReport.totalUsers}</div></div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))', gap:'24px' }}>

        {/* Task status */}
        {dashboardReport && (
          <div style={panel}>
            <h3 style={{ marginBottom:'18px', color:titleClr, fontSize:'16px', fontWeight:'700' }}>Task Status Distribution</h3>
            {Object.entries(dashboardReport.taskStatusBreakdown).map(([status, count]) => {
              const total = Object.values(dashboardReport.taskStatusBreakdown).reduce((a,b)=>a+b,0)
              const pct = total > 0 ? (count/total)*100 : 0
              return (
                <div key={status} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'13px' }}>
                    <span style={{ fontWeight:'600', color:titleClr }}>{status}</span>
                    <span style={{ color:labelClr }}>{count} ({pct.toFixed(1)}%)</span>
                  </div>
                  <div style={barTrack}>
                    <div style={{ width:`${pct}%`, height:'100%', background:color(status), transition:'width 0.6s', borderRadius:'4px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Project progress */}
        {projectReport && (
          <div style={panel}>
            <h3 style={{ marginBottom:'18px', color:titleClr, fontSize:'16px', fontWeight:'700' }}>Project Progress</h3>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ fontSize:'52px', fontWeight:'800', color: dark?'#a78bfa':'#667eea', lineHeight:1 }}>
                {projectReport.averageProgress.toFixed(0)}%
              </div>
              <div style={{ fontSize:'13px', color:labelClr, marginTop:'4px' }}>Average Completion</div>
            </div>
            {projectReport.projects.slice(0,5).map(p => (
              <div key={p.id} style={{ marginBottom:'14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'13px' }}>
                  <span style={{ fontWeight:'600', color:titleClr }}>{p.title}</span>
                  <span style={{ color:labelClr }}>{p.progress}%</span>
                </div>
                <div style={barTrack}>
                  <div style={{ width:`${p.progress}%`, height:'100%', background: dark?'linear-gradient(90deg,#7c3aed,#a78bfa)':'linear-gradient(90deg,#667eea,#764ba2)', transition:'width 0.6s', borderRadius:'4px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hours by user */}
        {timeReport && (
          <div style={panel}>
            <h3 style={{ marginBottom:'18px', color:titleClr, fontSize:'16px', fontWeight:'700' }}>Hours by Team Member</h3>
            {Object.entries(timeReport.hoursByUser).map(([user, hours]) => {
              const max = Math.max(...Object.values(timeReport.hoursByUser))
              const pct = max > 0 ? (hours/max)*100 : 0
              return (
                <div key={user} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'13px' }}>
                    <span style={{ fontWeight:'600', color:titleClr }}>{user}</span>
                    <span style={{ color:labelClr }}>{hours.toFixed(1)}h</span>
                  </div>
                  <div style={barTrack}>
                    <div style={{ width:`${pct}%`, height:'100%', background: dark?'linear-gradient(90deg,#0369a1,#38bdf8)':'linear-gradient(90deg,#4facfe,#00f2fe)', transition:'width 0.6s', borderRadius:'4px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Weekly activity */}
        {timeReport && Object.keys(timeReport.hoursByDate).length > 0 && (
          <div style={panel}>
            <h3 style={{ marginBottom:'18px', color:titleClr, fontSize:'16px', fontWeight:'700' }}>Weekly Activity</h3>
            {Object.entries(timeReport.hoursByDate).map(([date, hours]) => {
              const max = Math.max(...Object.values(timeReport.hoursByDate))
              const pct = max > 0 ? (hours/max)*100 : 0
              return (
                <div key={date} style={{ marginBottom:'14px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px', fontSize:'13px' }}>
                    <span style={{ fontWeight:'600', color:titleClr }}>{new Date(date).toLocaleDateString()}</span>
                    <span style={{ color:labelClr }}>{hours.toFixed(1)}h</span>
                  </div>
                  <div style={barTrack}>
                    <div style={{ width:`${pct}%`, height:'100%', background: dark?'linear-gradient(90deg,#065f46,#34d399)':'linear-gradient(90deg,#43e97b,#38f9d7)', transition:'width 0.6s', borderRadius:'4px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
