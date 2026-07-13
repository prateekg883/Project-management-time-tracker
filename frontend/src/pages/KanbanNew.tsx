import React, { useEffect, useState } from 'react'
import { useTheme } from '../App'
import api from '../services/client'

interface Card {
  id: number
  title: string
  description?: string
  position: number
  assignee?: { id: number; fullName: string }
}

interface Column {
  id: number
  name: string
  cards: Card[]
}

export default function Kanban() {
  const { dark } = useTheme()
  const [columns, setColumns] = useState<Column[]>([])
  const [loading, setLoading] = useState(true)
  const [showCardModal, setShowCardModal] = useState(false)
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [editingCard, setEditingCard] = useState<Card | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '' })
  const [draggedCard, setDraggedCard] = useState<{ cardId: number; fromColumnId: number } | null>(null)
  const [columnName, setColumnName] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const resp = await api.get('/kanban/columns')
      setColumns(resp.data || [])
    } catch (err) {
      console.error('Error loading kanban:', err)
    } finally {
      setLoading(false)
    }
  }

  const openAddCard = (columnId: number) => {
    setSelectedColumn(columnId)
    setEditingCard(null)
    setFormData({ title: '', description: '' })
    setShowCardModal(true)
  }

  const openEditCard = (card: Card) => {
    setEditingCard(card)
    setFormData({ title: card.title, description: card.description || '' })
    setShowCardModal(true)
  }

  const saveCard = async () => {
    try {
      if (editingCard) {
        // Update card
        await api.post(`/kanban/cards/${editingCard.id}`, formData)
      } else {
        // Create card
        await api.post('/kanban/cards', {
          columnId: selectedColumn,
          ...formData
        })
      }
      setShowCardModal(false)
      await load()
    } catch (err) {
      console.error('Error saving card:', err)
      alert('Failed to save card')
    }
  }

  const deleteCard = async (cardId: number) => {
    if (!confirm('Delete this card?')) return
    try {
      await api.post(`/kanban/cards/${cardId}/delete`)
      await load()
    } catch (err) {
      console.error('Error deleting card:', err)
      alert('Failed to delete card')
    }
  }

  const moveCard = async (cardId: number, destColumnId: number) => {
    try {
      await api.post(`/kanban/cards/${cardId}/move`, { destColumnId, destPosition: 0 })
      await load()
    } catch (err) {
      console.error('Move failed', err)
    }
  }

  const handleDragStart = (e: React.DragEvent, cardId: number, columnId: number) => {
    setDraggedCard({ cardId, fromColumnId: columnId })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetColumnId: number) => {
    e.preventDefault()
    if (draggedCard && draggedCard.fromColumnId !== targetColumnId) {
      await moveCard(draggedCard.cardId, targetColumnId)
    }
    setDraggedCard(null)
  }

  const handleDragEnd = () => {
    setDraggedCard(null)
  }

  const saveColumn = async () => {
    if (!columnName.trim()) {
      alert('Please enter a column name')
      return
    }
    try {
      await api.post('/kanban/columns', { name: columnName })
      setShowColumnModal(false)
      setColumnName('')
      await load()
    } catch (err) {
      console.error('Error creating column:', err)
      alert('Failed to create column')
    }
  }

  return (
    <div className="kanban">
      <div className="kanban-header">
        <h2>Kanban Board</h2>
        {currentUser && (
          <div style={{ padding: '8px 16px', background: dark?'rgba(167,139,250,0.12)':'#f3f4f6', borderRadius: '8px', fontSize: '14px', color: dark?'#c4b5fd':'#667eea', fontWeight: '600', marginLeft: 'auto', marginRight: '10px' }}>
            {currentUser.fullName} ({currentUser.role === 'ADMIN' ? '👨‍💼 Admin' : currentUser.role === 'PROJECT_MANAGER' ? '📋 Manager' : '👤 Member'})
          </div>
        )}
        <div className="kanban-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowColumnModal(true)}
            disabled={!currentUser}
          >
            + Add Column
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {!loading && columns.length === 0 && <div>No columns found.</div>}

      {!currentUser && (
        <div style={{ 
          padding: '15px', 
          background: dark?'rgba(251,191,36,0.08)':'#fef3c7', 
          border: `1px solid ${dark?'rgba(251,191,36,0.2)':'#fbbf24'}`, 
          borderRadius: '8px', 
          marginBottom: '20px', 
          fontSize: '14px', 
          color: dark?'#fbbf24':'#92400e',
          textAlign: 'center'
        }}>
          🔒 Please login to drag & drop cards and make changes
        </div>
      )}

      <div className="columns">
        {columns.map(col => (
          <div 
            key={col.id} 
            className="column"
            onDragOver={currentUser ? handleDragOver : undefined}
            onDrop={currentUser ? (e) => handleDrop(e, col.id) : undefined}
          >
            <h3>{col.name}</h3>
            <button 
              className="btn btn-success btn-sm" 
              style={{ marginBottom: '1rem', width: '100%' }}
              onClick={() => openAddCard(col.id)}
              disabled={!currentUser}
            >
              + Add Card
            </button>
            <div className="cards">
              {col.cards?.map(card => (
                <div 
                  key={card.id} 
                  className="card" 
                  draggable={!!currentUser}
                  onDragStart={currentUser ? (e) => handleDragStart(e, card.id, col.id) : undefined}
                  onDragEnd={currentUser ? handleDragEnd : undefined}
                  onClick={() => openEditCard(card)}
                  style={{
                    opacity: draggedCard?.cardId === card.id ? 0.5 : 1,
                    cursor: currentUser ? 'grab' : 'default'
                  }}
                >
                  <div className="card-title">{card.title}</div>
                  {card.description && (
                    <div className="card-description">{card.description}</div>
                  )}
                  {card.assignee && (
                    <div className="card-meta">
                      <span className="card-tag">👤 {card.assignee.fullName}</span>
                    </div>
                  )}
                  <div className="card-actions">
                    {currentUser && columns.map(c => c.id !== col.id && (
                      <button
                        key={c.id}
                        className="btn btn-sm btn-secondary"
                        onClick={(e) => { e.stopPropagation(); moveCard(card.id, c.id) }}
                      >
                        → {c.name}
                      </button>
                    ))}
                    {currentUser && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => { e.stopPropagation(); deleteCard(card.id) }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Card Modal */}
      {showCardModal && (
        <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingCard ? 'Edit Card' : 'New Card'}</h3>
            <div className="form-group">
              <label>Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter card title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter card description"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowCardModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveCard}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Column Modal */}
      {showColumnModal && (
        <div className="modal-overlay" onClick={() => setShowColumnModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>New Column</h3>
            <div className="form-group">
              <label>Column Name</label>
              <input 
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                placeholder="Enter column name" 
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowColumnModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveColumn}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
