import React, { useState, useEffect } from 'react'
import { useTheme } from '../App'
import api from '../services/client'

interface TimeLog  { id:number; taskTitle:string; userName:string; hours:number; date:string; description:string }
interface TimeEntry { id:number; taskId:number; userId:number; description:string; startTime:string; endTime?:string }
interface Task      { id:number; title:string }

export default function TimeTracking() {
  const { dark } = useTheme()
  const [logs,          setLogs]          = useState<TimeLog[]>([])
  const [tasks,         setTasks]         = useState<Task[]>([])
  const [currentUser,   setCurrentUser]   = useState<any>(null)
  const [loading,       setLoading]       = useState(true)
  const [activeEntry,   setActiveEntry]   = useState<TimeEntry|null>(null)
  const [isTracking,    setIsTracking]    = useState(false)
  const [elapsedTime,   setElapsedTime]   = useState(0)
  const [showAddForm,   setShowAddForm]   = useState(false)
  const [filterTask,    setFilterTask]    = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState<number>(0)
  const [manualHours,    setManualHours]    = useState<number>(0)
  const [manualDate,     setManualDate]     = useState(new Date().toISOString().split('T')[0])
  const [description,    setDescription]    = useState('')

  useEffect(() => {
    const u = localStorage.getItem('user'); if (u) setCurrentUser(JSON.parse(u))
  }, [])
  useEffect(() => { loadTimeLogs(); loadTasks() }, [])
  useEffect(() => {
    let t: NodeJS.Timeout|null = null
    if (isTracking && activeEntry) {
      t = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - new Date(activeEntry.startTime).getTime()) / 1000))
      }, 1000)
    }
    return () => { if (t) clearInterval(t) }
  }, [isTracking, activeEntry])

  const loadTimeLogs = async () => {
    try { const r = await api.get('/timelogs'); setLogs(r.data) }
    catch(e) { console.error(e) } finally { setLoading(false) }
  }
  const loadTasks = async () => {
    try { const r = await api.get('/tasks'); setTasks(r.data) } catch(e) { console.error(e) }
  }

  const startTimer = async () => {
    if (!selectedTaskId) { alert('Select a task first'); return }
    try {
      const r = await api.post('/time-entries/start', { taskId:selectedTaskId, userId:currentUser?.id??1, description })
      setActiveEntry(r.data); setIsTracking(true); setElapsedTime(0); setDescription('')
    } catch(e) { console.error(e); alert('Failed to start timer') }
  }
  const stopTimer = async () => {
    if (!activeEntry) return
    try { await api.put(`/time-entries/${activeEntry.id}/stop`); setIsTracking(false); setActiveEntry(null); setElapsedTime(0); loadTimeLogs() }
    catch(e) { console.error(e); alert('Failed to stop timer') }
  }
  const addManualEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTaskId || !manualHours) { alert('Fill in all required fields'); return }
    try {
      await api.post('/timelogs', { taskId:selectedTaskId, userId:currentUser?.id??1, date:manualDate, hoursSpent:manualHours, description })
      setShowAddForm(false); setSelectedTaskId(0); setManualHours(0); setDescription(''); loadTimeLogs()
    } catch(e) { console.error(e); alert('Failed to add entry') }
  }
  const deleteLog = async (id: number) => {
    if (!confirm('Delete this entry?')) return
    try { await api.post(`/timelogs/${id}/delete`); loadTimeLogs() } catch(e) { console.error(e) }
  }

  const fmt = (s: number) =>
    `${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor((s%3600)/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`

  const filtered   = filterTask ? logs.filter(l => l.taskTitle.toLowerCase().includes(filterTask.toLowerCase())) : logs
  const totalHours = filtered.reduce((a,l) => a+l.hours, 0)

  if (loading) return <div className="loading">Loading time logs…</div>

  // theme tokens
  const inputSty: React.CSSProperties = {
    width:'100%', padding:'10px 12px',
    background: dark?'#131720':'white',
    border:`1px solid ${dark?'rgba(255,255,255,0.1)':'#e5e7eb'}`,
    borderRadius:'8px', color: dark?'#f1f5f9':'#1e293b',
    fontSize:'14px', outline:'none', fontFamily:'inherit',
  }
  const badgeBg  = dark?'rgba(167,139,250,0.12)':'#f3f4f6'
  const badgeTx  = dark?'#c4b5fd':'#667eea'
  const warnBg   = dark?'rgba(251,191,36,0.08)':'#fef3c7'
  const warnBdr  = dark?'rgba(251,191,36,0.2)':'#fbbf24'
  const warnTx   = dark?'#fbbf24':'#92400e'
  const formBg   = dark?'rgba(255,255,255,0.03)':'#f9fafb'
  const formBdr  = dark?'rgba(255,255,255,0.06)':'#e5e7eb'

  return (
    <div className="dashboard">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <h2>Time Tracking</h2>
        {currentUser && (
          <span style={{ padding:'7px 14px', background:badgeBg, borderRadius:'8px', fontSize:'13px', color:badgeTx, fontWeight:'600' }}>
            {currentUser.fullName}
          </span>
        )}
      </div>

      {/* Timer panel */}
      {currentUser ? (
        <div style={{
          background: dark?'linear-gradient(135deg,rgba(124,58,237,0.7),rgba(167,139,250,0.4))':'linear-gradient(135deg,#667eea,#764ba2)',
          border: dark?'1px solid rgba(167,139,250,0.25)':'none',
          padding:'28px', borderRadius:'14px', marginBottom:'20px', color:'white',
        }}>
          <h3 style={{ color:'white', marginBottom:'18px', fontSize:'16px', fontWeight:'700' }}>⏱ Active Timer</h3>
          {isTracking ? (
            <div>
              <div style={{ fontSize:'52px', fontWeight:'800', fontFamily:'monospace', marginBottom:'12px', letterSpacing:'2px', textShadow:'0 0 20px rgba(255,255,255,0.3)' }}>
                {fmt(elapsedTime)}
              </div>
              <p style={{ marginBottom:'18px', opacity:0.85 }}>
                Tracking: <strong>{tasks.find(t=>t.id===selectedTaskId)?.title||'Unknown Task'}</strong>
              </p>
              <button onClick={stopTimer} className="btn btn-danger">⏹ Stop Timer</button>
            </div>
          ) : (
            <div style={{ display:'grid', gap:'12px' }}>
              <select value={selectedTaskId} onChange={e=>setSelectedTaskId(Number(e.target.value))}
                style={{ ...inputSty, background: dark?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.9)', color: dark?'white':'#1e293b', border:'1px solid rgba(255,255,255,0.25)' }}>
                <option value={0}>Select a task…</option>
                {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
              <input type="text" placeholder="Description (optional)" value={description} onChange={e=>setDescription(e.target.value)}
                style={{ ...inputSty, background:'rgba(255,255,255,0.1)', color:'white', border:'1px solid rgba(255,255,255,0.25)', '::placeholder':{color:'rgba(255,255,255,0.6)'} } as any} />
              <button onClick={startTimer} disabled={!selectedTaskId} className="btn btn-success" style={{ width:'fit-content' }}>
                ▶ Start Timer
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ padding:'24px', background:warnBg, border:`1px solid ${warnBdr}`, borderRadius:'12px', marginBottom:'20px', textAlign:'center' }}>
          <p style={{ color:warnTx, fontWeight:'600' }}>🔒 Login to use the timer and log time entries.</p>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display:'flex', gap:'10px', alignItems:'center', flexWrap:'wrap', marginBottom:'16px' }}>
        {currentUser && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary btn-sm">
            {showAddForm ? '✕ Cancel' : '+ Manual Entry'}
          </button>
        )}
        <input type="text" placeholder="Filter by task…" value={filterTask} onChange={e=>setFilterTask(e.target.value)}
          style={{ ...inputSty, maxWidth:'260px', padding:'8px 12px' }} />
        <span style={{ marginLeft:'auto', fontWeight:'700', color:'var(--text-primary)', fontSize:'15px' }}>
          Total: {totalHours.toFixed(1)}h
        </span>
      </div>

      {/* Manual entry form */}
      {showAddForm && currentUser && (
        <div style={{ background:formBg, border:`1px solid ${formBdr}`, padding:'20px', borderRadius:'12px', marginBottom:'20px' }}>
          <h3 style={{ marginBottom:'16px', fontSize:'15px' }}>Add Manual Entry</h3>
          <form onSubmit={addManualEntry}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
              <div>
                <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px', color:'var(--text-secondary)' }}>Task *</label>
                <select value={selectedTaskId} onChange={e=>setSelectedTaskId(Number(e.target.value))} required style={inputSty}>
                  <option value={0}>Select a task…</option>
                  {tasks.map(t=><option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px', color:'var(--text-secondary)' }}>Date *</label>
                <input type="date" value={manualDate} onChange={e=>setManualDate(e.target.value)} required style={inputSty} />
              </div>
              <div>
                <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px', color:'var(--text-secondary)' }}>Hours *</label>
                <input type="number" step="0.5" min="0" value={manualHours} onChange={e=>setManualHours(Number(e.target.value))} required style={inputSty} />
              </div>
              <div>
                <label style={{ display:'block', marginBottom:'5px', fontWeight:'600', fontSize:'13px', color:'var(--text-secondary)' }}>Description</label>
                <input type="text" value={description} onChange={e=>setDescription(e.target.value)} style={inputSty} />
              </div>
            </div>
            <button type="submit" className="btn btn-success btn-sm">✓ Add Entry</button>
          </form>
        </div>
      )}

      {/* Logs list */}
      <div className="section">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
          <h3>Recent Time Logs</h3>
          {!currentUser && (
            <span style={{ padding:'6px 12px', background:warnBg, border:`1px solid ${warnBdr}`, borderRadius:'8px', fontSize:'12px', color:warnTx }}>
              🔒 Login to add / delete
            </span>
          )}
        </div>
        <div className="item-list">
          {filtered.map(log => (
            <div key={log.id} className="item-card" style={{ position:'relative', paddingRight:'56px' }}>
              <h4>{log.taskTitle}</h4>
              <p><strong>{log.hours}h</strong> &bull; {log.date} &bull; {log.userName}</p>
              {log.description && <p style={{ marginTop:'4px' }}>{log.description}</p>}
              {currentUser && (
                <button onClick={() => deleteLog(log.id)} className="btn btn-danger btn-sm"
                  style={{ position:'absolute', top:'12px', right:'12px' }}>
                  🗑
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color:'var(--text-muted)' }}>No time logs found.</p>}
        </div>
      </div>
    </div>
  )
}
