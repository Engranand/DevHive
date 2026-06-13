import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'

const PROJECT_ID = '6a2c7ce76ec1258f7b8e9357'

export default function Sprints() {
  const [sprint, setSprint] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/sprints?projectId=${PROJECT_ID}`)
        const activeSprint = data.sprints.find(s => s.status === 'active') || data.sprints[0]
        setSprint(activeSprint)

        if (activeSprint) {
          const { data: statsData } = await api.get(`/sprints/${activeSprint._id}/stats`)
          setStats(statsData.stats)
        }
      } catch (err) {
        console.error('Failed to fetch sprint:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-muted text-sm font-mono">Loading sprint data...</div>
      </Layout>
    )
  }

  if (!sprint) {
    return (
      <Layout>
        <div className="p-6 text-muted text-sm font-mono">No sprint found.</div>
      </Layout>
    )
  }

  const completionPct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  const daysLeft = Math.max(0, Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24)))

  return (
    <Layout>
      <div className="p-6 space-y-5">

        {/* Header */}
        <div>
          <div className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
            // Sprint Planning
          </div>
          <h1 className="text-xl font-bold text-text">{sprint.name}</h1>
          <p className="text-muted text-sm mt-0.5">{sprint.goal}</p>
        </div>


        {/* Breakdown */}
        {/* Sprint Health */}
{(() => {
  let risk = 'Low'
  let riskColor = 'text-success'
  let riskBg = 'bg-success/10 border-success/20'

  if (stats.blocked > 0 && daysLeft <= 2) {
    risk = 'High'
    riskColor = 'text-danger'
    riskBg = 'bg-danger/10 border-danger/20'
  } else if (stats.blocked > 0 || completionPct < 60) {
    risk = 'Medium'
    riskColor = 'text-warning'
    riskBg = 'bg-warning/10 border-warning/20'
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">// Sprint Health</div>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${riskColor}`}>{risk} Risk</span>
            <span className={`text-xs px-2 py-0.5 rounded border font-mono ${riskBg} ${riskColor}`}>
              {daysLeft}d left
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-text">{completionPct}%</div>
          <div className="text-xs text-muted">complete</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border">
        {[
          { label: 'Backlog', value: stats.backlog, color: 'text-muted' },
          { label: 'In Progress', value: stats.in_progress, color: 'text-warning' },
          { label: 'In Review', value: stats.in_review, color: 'text-purple' },
          { label: 'Done', value: stats.done, color: 'text-success' },
        ].map(item => (
          <div key={item.label}>
            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">{item.label}</div>
            <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      {stats.blocked > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm">
          <span className="text-danger">🚫</span>
          <span className="text-text2">{stats.blocked} task{stats.blocked > 1 ? 's' : ''} blocked</span>
        </div>
      )}
    </div>
  )
})()}

        {/* Sprint Dates */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="text-xs text-muted font-mono uppercase tracking-wider mb-3">// Timeline</div>
          <div className="flex items-center justify-between text-sm">
            <div>
              <div className="text-xs text-muted mb-1">Start Date</div>
              <div className="text-text font-medium">{new Date(sprint.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <div className="flex-1 mx-4 h-px bg-border" />
            <div className="text-right">
              <div className="text-xs text-muted mb-1">End Date</div>
              <div className="text-text font-medium">{new Date(sprint.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}