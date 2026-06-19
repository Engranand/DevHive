import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSelector } from 'react-redux'



export default function Sprints() {
 const { activeProject } = useSelector((state) => state.auth)
  const PROJECT_ID = activeProject?._id
  const [sprint, setSprint] = useState(null)
  const [stats, setStats] = useState(null)
  const [workload, setWorkload] = useState(null)
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
          const { data: workloadData } = await api.get(`/projects/${PROJECT_ID}/workload`)
          setWorkload(workloadData.workload)
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

  const totalDays = Math.ceil((new Date(sprint.endDate) - new Date(sprint.startDate)) / (1000 * 60 * 60 * 24))
  const daysPassed = totalDays - daysLeft
  const totalTasks = stats.total
  const remainingTasks = totalTasks - stats.done

  const burndownData = []
  for (let day = 0; day <= totalDays; day++) {
    const ideal = Math.max(0, Math.round(totalTasks - (totalTasks / totalDays) * day))
    const point = { day: `Day ${day}`, ideal }
    if (day <= daysPassed) {
      point.actual = day === daysPassed ? remainingTasks : null
    }
    burndownData.push(point)
  }

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

        {/* Sprint Health — Bug 1 Fixed: () => {} to (() => {})() */}
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

              {/* Bug 2 Fixed: {[ array ].map()} wrapped in curly braces */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-border">
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

        {/* AI Sprint Risk */}
        {(() => {
          const overloaded = (workload || []).filter(w => w.overloaded)
          const reasons = []

          if (overloaded.length > 0) {
            overloaded.forEach(w => reasons.push(`${w.name} overloaded (+${w.deviation}%)`))
          }
          if (stats.blocked > 0) {
            reasons.push(`${stats.blocked} task${stats.blocked > 1 ? 's' : ''} blocked`)
          }
          if (daysLeft <= 2) {
            reasons.push(`Sprint ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`)
          }

          if (reasons.length === 0) return null

          let recommendation = null
          if (overloaded.length > 0 && workload.length > 1) {
            const mostLoaded = workload.reduce((a, b) => (a.score > b.score ? a : b))
            const leastLoaded = workload.reduce((a, b) => (a.score < b.score ? a : b))
            if (mostLoaded.userId !== leastLoaded.userId) {
              recommendation = `Move a task from ${mostLoaded.name} to ${leastLoaded.name} (${leastLoaded.deviation}% capacity)`
            }
          }

          return (
            <div className="bg-surface border border-purple/20 rounded-xl p-5">
              <div className="text-xs text-purple font-mono uppercase tracking-wider mb-3">// AI Sprint Analysis</div>
              <div className="space-y-1.5 mb-3">
                {reasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-text2">
                    <span className="text-warning">•</span>
                    {reason}
                  </div>
                ))}
              </div>
              {recommendation && (
                <div className="pt-3 border-t border-border">
                  <div className="text-xs text-purple font-mono uppercase tracking-wider mb-1">Recommendation</div>
                  <div className="text-sm text-text2">{recommendation}</div>
                </div>
              )}
            </div>
          )
        })()}

        {/* Team Capacity */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="text-xs text-muted font-mono uppercase tracking-wider mb-4">// Team Capacity</div>
          <div className="space-y-3">
            {(workload || []).map(member => {
              const maxScore = Math.max(...workload.map(w => w.score), 1)
              const widthPct = Math.round((member.score / maxScore) * 100)
              const barColor = member.overloaded ? 'bg-danger' : 'bg-accent'

              return (
                <div key={member.userId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text2">{member.name}</span>
                    <span className={`text-xs font-mono ${member.overloaded ? 'text-danger' : 'text-muted'}`}>
                      {member.openTasks} task{member.openTasks !== 1 ? 's' : ''} · {member.score}pts
                      {member.overloaded && ' ⚠'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${widthPct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="text-xs text-muted font-mono uppercase tracking-wider mb-4">
            // Burndown Chart
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={burndownData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#21262d" />
              <XAxis dataKey="day" tick={{ fill: '#7d8590', fontSize: 11 }} axisLine={{ stroke: '#21262d' }} />
              <YAxis tick={{ fill: '#7d8590', fontSize: 11 }} axisLine={{ stroke: '#21262d' }} />
              <Tooltip
                contentStyle={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e6edf3' }}
              />
              <Line type="monotone" dataKey="ideal" stroke="#4a5568" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Ideal" />
              <Line type="monotone" dataKey="actual" stroke="#4f8cff" strokeWidth={2} dot={{ fill: '#4f8cff', r: 4 }} name="Actual" connectNulls />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#4a5568] inline-block"></span>
              Ideal
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-accent inline-block"></span>
              Actual
            </div>
          </div>
        </div>

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