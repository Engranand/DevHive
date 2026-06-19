import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Layout from '../components/Layout'
import api from '../services/api'



export default function Dashboard() {
  const { user, activeProject } = useSelector((state) => state.auth)
  const PROJECT_ID = activeProject?._id
  const [sprint, setSprint] = useState(null)
  const [stats, setStats] = useState(null)
  const [workload, setWorkload] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sprintRes, workloadRes] = await Promise.all([
          api.get(`/sprints?projectId=${PROJECT_ID}`),
          api.get(`/projects/${PROJECT_ID}/workload`),
        ])

        const activeSprint = sprintRes.data.sprints.find(s => s.status === 'active') || sprintRes.data.sprints[0]
        setSprint(activeSprint)
        setWorkload(workloadRes.data.workload)

        if (activeSprint) {
          const statsRes = await api.get(`/sprints/${activeSprint._id}/stats`)
          setStats(statsRes.data.stats)
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Computed values
  const daysLeft = sprint ? Math.max(0, Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24))) : 0
  const completionPct = stats ? Math.round((stats.done / stats.total) * 100) : 0
  const overloadedMembers = workload.filter(w => w.overloaded)

  // Health Score
  let healthScore = 100
  if (stats) {
    if (stats.blocked > 0) healthScore -= stats.blocked * 10
    if (completionPct < 50) healthScore -= 10
    if (daysLeft <= 2) healthScore -= 15
  }
  overloadedMembers.forEach(() => { healthScore -= 5 })
  healthScore = Math.max(0, Math.min(100, healthScore))

  // Sprint Risk
  let sprintRisk = 'Low'
  let riskColor = 'text-success'
  if (stats?.blocked > 0 && daysLeft <= 2) { sprintRisk = 'High'; riskColor = 'text-danger' }
  else if (stats?.blocked > 0 || completionPct < 60) { sprintRisk = 'Medium'; riskColor = 'text-warning' }

  // Action Alerts
  const alerts = []
  if (daysLeft <= 2) alerts.push({ icon: '⚠', text: `Sprint ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`, type: 'warning' })
  overloadedMembers.forEach(m => alerts.push({ icon: '🔴', text: `${m.name} overloaded — ${m.deviation}% above average`, type: 'danger' }))
  if (stats?.blocked > 0) alerts.push({ icon: '◻', text: `${stats.blocked} task${stats.blocked > 1 ? 's' : ''} blocked in Review`, type: 'warning' })

  const maxScore = workload.length > 0 ? Math.max(...workload.map(w => w.score), 1) : 1

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-muted text-sm font-mono">Loading dashboard...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
              // Engineering Overview
            </div>
            <h1 className="text-xl font-bold text-text">Workspace Overview</h1>
            <p className="text-muted text-sm mt-0.5">
              Project Atlas · {sprint?.name || 'No sprint'} · {workload.length} members
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-success font-mono bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              Real-time engine online
            </div>
            <button 
              onClick={() => window.location.href = '/board'}
             className="bg-accent hover:bg-accent2 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium">
            + New Task
             </button>
          </div>
        </div>

        {/* Action Center */}
        {alerts.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xs font-mono text-muted uppercase tracking-wider">// Action Required</div>
              <div className="bg-danger/10 text-danger text-xs font-mono px-2 py-0.5 rounded border border-danger/20">
                {alerts.length} alerts
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {alerts.map((action, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                  action.type === 'danger' ? 'bg-danger/5 border-danger/20 text-danger' :
                  action.type === 'warning' ? 'bg-warning/5 border-warning/20 text-warning' :
                  'bg-accent/5 border-accent/20 text-accent'
                }`}>
                  <span>{action.icon}</span>
                  <span className="text-xs">{action.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Health Score', value: healthScore, unit: '/100', color: healthScore > 70 ? 'text-success' : healthScore > 50 ? 'text-warning' : 'text-danger' },
            { label: 'Sprint Risk', value: sprintRisk, unit: `${daysLeft}d left`, color: riskColor },
            { label: 'Tasks Done', value: stats?.done || 0, unit: `of ${stats?.total || 0}`, color: 'text-success' },
            { label: 'Completion', value: `${completionPct}%`, unit: 'this sprint', color: 'text-accent' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
              <div className="text-xs text-muted font-mono uppercase tracking-wider mb-2">{stat.label}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted mt-1">{stat.unit}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* AI Workload */}
          <div className="bg-surface border border-accent/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-mono text-accent uppercase tracking-wider mb-0.5">// AI Workload Intelligence</div>
                <div className="text-xs text-muted">Fairness engine · updates every 30min</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                live
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {workload.map((member) => {
                const widthPct = Math.round((member.score / maxScore) * 100)
                return (
                  <div key={member.userId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${
                          member.overloaded ? 'bg-danger/20 text-danger' : 'bg-accent/10 text-accent'
                        }`}>
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-xs text-text">{member.name}</span>
                        <span className="text-xs text-muted">· {member.score}pts</span>
                      </div>
                      <span className={`text-xs font-mono ${member.overloaded ? 'text-danger' : 'text-muted'}`}>
                        {member.deviation > 0 ? '+' : ''}{member.deviation}%
                        {member.overloaded && ' ⚠'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${member.overloaded ? 'bg-danger' : 'bg-accent'}`}
                        style={{ width: `${widthPct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {overloadedMembers.length > 0 && (
              <div className="p-3 bg-bg border-l-2 border-accent border border-border rounded-lg">
                <div className="text-xs text-accent font-mono uppercase tracking-wider mb-1">Workload imbalance detected</div>
                <div className="text-xs text-text2 leading-relaxed">
                  {overloadedMembers[0].name} exceeds team average by {overloadedMembers[0].deviation}%.
                  {workload.length > 0 && ` Reassigning tasks to ${workload.reduce((a, b) => a.score < b.score ? a : b).name} would rebalance sprint.`}
                </div>
              </div>
            )}
          </div>

          {/* Live Activity */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-mono text-muted uppercase tracking-wider">// Live Activity</div>
              <div className="flex items-center gap-1.5 text-xs text-success font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                live
              </div>
            </div>
            <div className="space-y-1.5">
              {overloadedMembers.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface2 transition-colors">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 bg-danger/10 text-danger">⚡</div>
                  <div className="flex-1 text-xs text-text2">AI flagged {m.name} overloaded (+{m.deviation}%)</div>
                  <div className="text-xs text-muted font-mono">now</div>
                </div>
              ))}
              {stats?.blocked > 0 && (
                <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface2 transition-colors">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 bg-warning/10 text-warning">◻</div>
                  <div className="flex-1 text-xs text-text2">{stats.blocked} task{stats.blocked > 1 ? 's' : ''} blocked in Review</div>
                  <div className="text-xs text-muted font-mono">now</div>
                </div>
              )}
              <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface2 transition-colors">
                <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 bg-accent/10 text-accent">📊</div>
                <div className="flex-1 text-xs text-text2">Sprint {completionPct}% complete · {daysLeft}d left</div>
                <div className="text-xs text-muted font-mono">live</div>
              </div>
            </div>
          </div>

          {/* Sprint Status */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="text-xs font-mono text-muted uppercase tracking-wider mb-4">// Sprint Status</div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-text">{sprint?.name || 'Sprint'}</span>
                <span className="text-xs text-warning font-mono">{daysLeft}d left</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1">
                <div className="h-full bg-accent rounded-full transition-all duration-700" style={{ width: `${completionPct}%` }} />
              </div>
              <div className="text-xs text-muted">{completionPct}% complete · {stats?.done || 0} of {stats?.total || 0} tasks done</div>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { label: 'Done', count: stats?.done || 0, color: 'bg-success' },
                { label: 'In Progress', count: stats?.in_progress || 0, color: 'bg-accent' },
                { label: 'In Review', count: stats?.in_review || 0, color: 'bg-warning' },
                { label: 'Blocked', count: stats?.blocked || 0, color: 'bg-danger' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-xs text-muted">{item.label}</span>
                  </div>
                  <span className="text-xs font-mono text-text2">{item.count}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border space-y-1.5">
              <div className="text-xs text-muted font-mono mb-2">// Quick actions</div>
              {[
                { label: '+ Create task', color: 'text-accent' },
                { label: '⬡ Open Hive Board', color: 'text-purple' },
                { label: '🐙 View GitHub activity', color: 'text-success' },
              ].map((action) => (
                <button key={action.label} className={`block w-full text-left text-xs ${action.color} hover:opacity-70 transition-opacity py-1 font-mono`}>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}