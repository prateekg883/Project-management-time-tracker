import React, { useEffect, useState } from 'react'
import { useTheme } from '../App'
import api from '../services/client'

interface Project { id: number; title: string; status: string; description: string; startDate: string; endDate: string }
interface Task    { id: number; title: string; description: string; status: string; projectId: number; assignedUserId: number }

const STATUS_COLORS: Record<string, string> = {
  'To Do':       '#6b7280',
  'In Progress': '#3b82f6',
  'Completed':   '#10b981',
  'Blocked':     '#ef4444',
}
const STATUS_OPTIONS = ['TODO','IN_PROGRESS','COMPLETED','BLOCKED']
const STATUS_LABELS:  Record<string,string> = { TODO:'To Do', IN_PROGRESS:'In Progress', COMPLETED:'Completed', BLOCKED:'Blocked' }

export default function Dashboard() {
  const { dark } = useTheme()
  const [stats,    setStats]    = useState({ projects:0, tasks:0, totalTasks:0, users:0, hours:0 })
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks,    setTasks]    = useState<Task[]>([])
  const [loading,  setLoading]  = useState(true)
  const [currentUser,         setCurrentUser]         = useState<any>(null)
  const [canManageProjects,   setCanManageProjects]   = useState(false)
  const [showProjectForm,     setShowProjectForm]     = useState(false)
  const [newProjectTitle,     setNewProjectTitle]     = useState('')
  const [newProjectDesc,      setNewProjectDesc]      = useState('')
  const [saving,              setSaving]              = useState(false)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) { const p = JSON.parse(u); setCurrentUser(p); setCanManageProjects(p.role==='ADMIN'||p.role==='PROJECT_MANAGER') }
  }, [])
  useEffect(() => { loadDashboard() }, [])

  const loadDashboard = async () => {
    try {
      const [s, p, t] = await Promise.all([api.get('/dashboard/stats'), api.get('/projects'), api.get('/tasks')])
      setStats(s.data); setProjects(p.data); setTasks(t.data)
    } catch(e) { console.error(e) } finally { setLoading(false) }
  }

  const updateTaskStatus = async (id: number, status: string) => {
    try {
      await api.put(`/tasks/${id}/status`, { status })
      const [s, t] = await Promise.all([api.get('/dashboard/stats'), api.get('/tasks')])
      setStats(s.data); setTasks(t.data)
    } catch(e) { console.error(e); alert('Failed to update status') }
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault(); if (!newProjectTitle.trim()) return
    setSaving(true)
    try {
      await api.post('/projects', { title: newProjectTitle, description: newProjectDesc })
      setNewProjectTitle(''); setNewProjectDesc(''); setShowProjectForm(false); await loadDashboard()
    } catch(e) { console.error(e); alert('Failed to create project') } finally { setSaving(false) }
  }

  const deleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return
    try { await api.post(`/projects/${id}/delete`); await loadDashboard() }
    catch(e) { console.error(e); alert('Failed to delete project') }
  }

  if (loading) return <div className="loading">Loading dashboard…</div>

  // theme-aware inline colours
  const badgeBg   = dark ? 'rgba(167,139,250,0.12)' : '#f3f4f6'
  const badgeText = dark ? '#c4b5fd' : '#667eea'
  const warnBg    = dark ? 'rgba(251,191,36,0.08)'  : '#fef3c7'
  const warnBdr   = dark ? 'rgba(251,191,36,0.2)'   : '#fbbf24'
  const warnText  = dark ? '#fbbf24'                 : '#92400e'
  const formBg    = dark ? '#0e1117'                 : '#f9fafb'
  const inputSty: React.CSSProperties = {
    width:'100%', padding:'10px 12px',
    background: dark ? '#131720' : 'white',
    border:`1px solid ${dark?'rgba(255,255,255,0.1)':'#e5e7eb'}`,
    borderRadius:'8px', color: dark?'#f1f5f9':'#1e293b',
    fontSize:'14px', outline:'none', fontFamily:'inherit',
  }
  const selectSty: React.CSSProperties = {
    ...inputSty, marginLeft:'14px', minWidth:'130px', flexShrink:0, cursor:'pointer',
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h2>Project Dashboard</h2>
        {currentUser && (
          <span style={{ padding:'7px 14px', background:badgeBg, borderRadius:'8px', fontSize:'13px', color:badgeText, fontWeight:'600' }}>
            {currentUser.fullName}&nbsp;
            ({currentUser.role==='ADMIN'?'👨‍💼 Admin':currentUser.role==='PROJECT_MANAGER'?'📋 Manager':'👤 Member'})
          </span>
        )}
      </div>

      {!canManageProjects && (
        <div style={{ padding:'12px 16px', background:warnBg, border:`1px solid ${warnBdr}`, borderRadius:'8px', marginBottom:'20px', fontSize:'14px', color:warnText }}>
          ℹ️ View-only access. Contact Admin or Project Manager to manage projects.
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card"><h3>Total Projects</h3><div className="value">{stats.projects}</div></div>
        <div className="stat-card"><h3>Active Tasks</h3><div className="value">{stats.tasks}</div><div style={{fontSize:'11px',opacity:0.75,marginTop:'4px'}}>of {stats.totalTasks} total</div></div>
        <div className="stat-card"><h3>Team Members</h3><div className="value">{stats.users}</div></div>
        <div className="stat-card"><h3>Hours Logged</h3><div className="value">{stats.hours}</div></div>
      </div>

      {/* Projects */}
      <div className="section">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
          <h3>Projects</h3>
          {canManageProjects && (
            <button onClick={() => setShowProjectForm(!showProjectForm)} className="btn btn-primary btn-sm">
              {showProjectForm ? '✕ Cancel' : '+ New Project'}
            </button>
          )}
        </div>

        {showProjectForm && canManageProjects && (
          <form onSubmit={createProject} style={{ background:formBg, border:`1px solid ${dark?'rgba(255,255,255,0.07)':'#e5e7eb'}`, padding:'18px', borderRadius:'12px', marginBottom:'18px', display:'grid', gap:'12px' }}>
            <div>
              <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px', color: dark?'#94a3b8':'#374151' }}>Title *</label>
              <input value={newProjectTitle} onChange={e=>setNewProjectTitle(e.target.value)} required placeholder="Project title" style={inputSty} />
            </div>
            <div>
              <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px', color: dark?'#94a3b8':'#374151' }}>Description</label>
              <input value={newProjectDesc} onChange={e=>setNewProjectDesc(e.target.value)} placeholder="Optional" style={inputSty} />
            </div>
            <button type="submit" disabled={saving} className="btn btn-success btn-sm" style={{ justifySelf:'start' }}>
              {saving ? 'Creating…' : '✓ Create'}
            </button>
          </form>
        )}

        <div className="item-list">
          {projects.map(p => (
            <div key={p.id} className="item-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ flex:1 }}>
                  <h4>{p.title}</h4>
                  {p.description && <p>{p.description}</p>}
                  <div style={{ display:'flex', gap:'10px', marginTop:'6px', flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px', background: dark?'rgba(56,189,248,0.12)':'#e0f2fe', color: dark?'#38bdf8':'#0369a1', fontWeight:'600' }}>
                      {p.status}
                    </span>
                    {p.startDate && <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>Start: {p.startDate}</span>}
                    {p.endDate   && <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>End: {p.endDate}</span>}
                  </div>
                </div>
                {canManageProjects && (
                  <button onClick={() => deleteProject(p.id)} className="btn btn-danger btn-sm" style={{ marginLeft:'10px', flexShrink:0 }}>
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
          {projects.length === 0 && <p style={{ color:'var(--text-muted)' }}>No projects yet.</p>}
        </div>
      </div>

      {/* Tasks */}
      <div className="section">
        <h3 style={{ marginBottom:'14px' }}>All Tasks</h3>
        <div className="item-list">
          {tasks.map(t => {
            const col = STATUS_COLORS[t.status] ?? '#6b7280'
            return (
              <div key={t.id} className="item-card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ flex:1 }}>
                  <h4 style={{ marginBottom:'4px' }}>{t.title}</h4>
                  {t.description && <p>{t.description}</p>}
                  <span style={{
                    display:'inline-block', marginTop:'6px',
                    fontSize:'11px', padding:'3px 10px', borderRadius:'20px', fontWeight:'600',
                    background: col + (dark ? '22' : '18'),
                    color: col,
                    border: `1px solid ${col}44`,
                  }}>
                    {t.status}
                  </span>
                </div>
                {currentUser && (
                  <select
                    value={t.status==='To Do'?'TODO':t.status==='In Progress'?'IN_PROGRESS':t.status==='Completed'?'COMPLETED':t.status==='Blocked'?'BLOCKED':t.status}
                    onChange={e => updateTaskStatus(t.id, e.target.value)}
                    style={selectSty}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                )}
              </div>
            )
          })}
          {tasks.length === 0 && <p style={{ color:'var(--text-muted)' }}>No tasks found.</p>}
        </div>
      </div>
    </div>
  )
}
