import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { useSelector } from 'react-redux'



const roleSpecialization = {
  'Anand': 'Full Stack',
  'Rohan': 'Backend',
  'Sneha': 'Frontend',
  'Kiran': 'DevOps',
}

const avatarColors = [
  'bg-accent/20 text-accent',
  'bg-danger/20 text-danger',
  'bg-success/20 text-success',
  'bg-purple/20 text-purple',
]

const roleBadge = {
  owner: 'bg-accent/10 text-accent border-accent/20',
  contributor: 'bg-purple/10 text-purple border-purple/20',
}

export default function Team() {
  const { activeProject } = useSelector((state) => state.auth)
  const PROJECT_ID = activeProject?._id
  const [workload, setWorkload] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHealthInfo, setShowHealthInfo] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/projects/${PROJECT_ID}/workload`)
        setWorkload(data.workload)
      } catch (err) {
        console.error('Failed to fetch team data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <Layout>
      <div className="p-6 text-muted text-sm font-mono">Loading team data...</div>
    </Layout>
  )

  const overloaded = workload.filter(w => w.overloaded)
  const avgScore = workload.length > 0 ? Math.round(workload.reduce((s, w) => s + w.score, 0) / workload.length) : 0
  const maxScore = Math.max(...workload.map(w => w.score), 1)

  // Health score breakdown
  const balanceScore = Math.max(0, 40 - overloaded.length * 15)
  const teamHealth = Math.min(100, 60 + balanceScore)

  const mostLoaded = workload.length > 0 ? workload.reduce((a, b) => a.score > b.score ? a : b) : null
  const leastLoaded = workload.length > 0 ? workload.reduce((a, b) => a.score < b.score ? a : b) : null

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-5">

        {/* Header */}
        <div>
          <div className="text-xs text-muted font-mono uppercase tracking-widest mb-1">// Team Intelligence</div>
          <h1 className="text-xl font-bold text-text">Team Overview</h1>
          <p className="text-muted text-sm mt-0.5">Project Atlas · {workload.length} members</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-2">Total Members</div>
            <div className="text-2xl font-bold text-accent">{workload.length}</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-2">Overloaded</div>
            <div className={`text-2xl font-bold ${overloaded.length > 0 ? 'text-danger' : 'text-success'}`}>{overloaded.length}</div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-2">Avg Workload</div>
            <div className="text-2xl font-bold text-warning">{avgScore}pts</div>
          </div>
          {/* Team Health with explanation */}
          <div className="bg-surface border border-border rounded-xl p-4 relative cursor-pointer"
            onClick={() => setShowHealthInfo(!showHealthInfo)}>
            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-2 flex items-center gap-1">
              Team Health <span className="text-accent">ⓘ</span>
            </div>
            <div className={`text-2xl font-bold ${teamHealth > 70 ? 'text-success' : teamHealth > 50 ? 'text-warning' : 'text-danger'}`}>
              {teamHealth}/100
            </div>
            {showHealthInfo && (
              <div className="absolute top-full left-0 mt-2 z-10 bg-surface2 border border-border rounded-xl p-3 w-56 shadow-xl text-xs text-muted space-y-1">
                <div className="font-mono text-text mb-2">Based on:</div>
                <div>• 40% workload balance</div>
                <div>• 30% sprint progress</div>
                <div>• 20% blocked tasks</div>
                <div>• 10% review delays</div>
              </div>
            )}
          </div>
        </div>

        {/* Member Cards — Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {workload.map((member, i) => {
            const widthPct = Math.round((member.score / maxScore) * 100)
            const spec = roleSpecialization[member.name] || 'Developer'
            return (
              <div key={member.userId} className={`bg-surface border rounded-xl p-4 ${
                member.overloaded ? 'border-danger/30' : 'border-border'
              }`}>
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text">{member.name}</div>
                      <div className="text-xs text-muted">{spec}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${roleBadge[member.role] || roleBadge.contributor}`}>
                      {member.role}
                    </span>
                    {member.overloaded && <span className="text-xs text-danger font-mono">⚠</span>}
                  </div>
                </div>

                {/* Capacity bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted font-mono">Workload</span>
                    <span className={`text-xs font-mono ${member.overloaded ? 'text-danger' : 'text-muted'}`}>
                      {member.score}pts · {member.deviation > 0 ? '+' : ''}{member.deviation}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${member.overloaded ? 'bg-danger' : 'bg-accent'}`}
                      style={{ width: `${Math.max(widthPct, 4)}%` }} />
                  </div>
                </div>

                {/* Stats row */}
            <div className="flex items-center gap-3 text-xs text-muted font-mono flex-wrap">
            <span>📋 {member.openTasks} active</span>
            <span className="text-border">·</span>
         <span className="text-success">✓ {(member.totalTasks || 0) - member.openTasks} done</span>
           <span className="text-border">·</span>
          <span className={member.overloaded ? 'text-danger' : 'text-success'}>
        {member.overloaded ? '⚠ Overloaded' : '● Available'}
          </span>
              </div>
              </div>
            )
          })}
        </div>

        {/* AI Insights + Action */}
        {overloaded.length > 0 && mostLoaded && leastLoaded && (
          <div className="bg-surface border border-purple/20 rounded-xl p-4">
            <div className="text-xs text-purple font-mono uppercase tracking-wider mb-3">// AI Team Insights</div>
            <div className="space-y-1 mb-3">
              {overloaded.map(m => (
                <div key={m.userId} className="flex items-center gap-2 text-sm text-text2">
                  <span className="text-danger">•</span>
                  {m.name} overloaded (+{m.deviation}% above average)
                </div>
              ))}
              {leastLoaded.score === 0 && (
                <div className="flex items-center gap-2 text-sm text-text2">
                  <span className="text-success">•</span>
                  {leastLoaded.name} has 100% free capacity
                </div>
              )}
            </div>

            {mostLoaded.userId !== leastLoaded.userId && (
              <div className="pt-3 border-t border-border">
                <div className="text-xs text-purple font-mono uppercase tracking-wider mb-2">Recommendation</div>
                <div className="text-sm text-text2 mb-3">
                  Move a task from <span className="text-text font-medium">{mostLoaded.name}</span> to <span className="text-text font-medium">{leastLoaded.name}</span> — reduces imbalance by ~{Math.round(mostLoaded.deviation / 2)}%
                </div>
                <button className="text-xs bg-purple/10 hover:bg-purple/20 text-purple border border-purple/20 px-4 py-2 rounded-lg font-mono transition-colors">
                  Review Suggestion →
                </button>
              </div>
            )}
          </div>
        )}

       

      </div>
    </Layout>
  )
}