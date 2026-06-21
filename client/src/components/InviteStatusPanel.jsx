import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../services/api'

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning border-warning/20', icon: '⏳' },
  accepted: { label: 'Accepted', color: 'bg-success/10 text-success border-success/20', icon: '✓' },
  declined: { label: 'Declined', color: 'bg-danger/10 text-danger border-danger/20', icon: '✕' },
}

export default function InviteStatusPanel({ onClose }) {
  const { activeProject } = useSelector((state) => state.auth)
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const { data } = await api.get(`/invitations/project/${activeProject._id}`)
        setInvitations(data.invitations)
      } catch (err) {
        console.error('Failed to fetch invites:', err)
      } finally {
        setLoading(false)
      }
    }
    if (activeProject?._id) fetchInvites()
  }, [activeProject])

  const counts = {
    pending: invitations.filter(i => i.status === 'pending').length,
    accepted: invitations.filter(i => i.status === 'accepted').length,
    declined: invitations.filter(i => i.status === 'declined').length,
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-full max-w-sm bg-surface border-r border-border z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <div className="text-xs text-muted font-mono uppercase tracking-wider">// Invitations</div>
            <div className="text-sm font-bold text-text mt-0.5">{activeProject?.name}</div>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors text-xl">✕</button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-border">
          <div className="bg-bg border border-border rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-warning">{counts.pending}</div>
            <div className="text-xs text-muted font-mono">Pending</div>
          </div>
          <div className="bg-bg border border-border rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-success">{counts.accepted}</div>
            <div className="text-xs text-muted font-mono">Accepted</div>
          </div>
          <div className="bg-bg border border-border rounded-lg p-2.5 text-center">
            <div className="text-lg font-bold text-danger">{counts.declined}</div>
            <div className="text-xs text-muted font-mono">Declined</div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-muted text-sm font-mono text-center py-8">Loading...</div>
          ) : invitations.length === 0 ? (
            <div className="text-muted text-sm font-mono text-center py-8">No invitations sent yet.</div>
          ) : (
            invitations.map((invite) => {
              const status = statusConfig[invite.status]
              return (
                <div key={invite._id} className="bg-bg border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text font-medium truncate">{invite.email}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border font-mono flex-shrink-0 ml-2 ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                  <div className="text-xs text-muted">
                    Invited by {invite.invitedBy?.name || 'Unknown'} · {new Date(invite.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              )
            })
          )}
        </div>

      </div>
    </>
  )
}