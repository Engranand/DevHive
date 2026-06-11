import { useSelector } from 'react-redux'
import Layout from '../components/Layout'

const actions = [
  { icon: '⚠', text: 'Sprint ends in 2 days', type: 'warning' },
  { icon: '🔴', text: 'Anand overloaded — 42% above average', type: 'danger' },
  { icon: '◻', text: '2 tasks blocked in Review', type: 'warning' },
  { icon: '↑', text: '1 PR awaiting review — #142', type: 'info' },
]

const stats = [
  { label: 'Health Score', value: '87', unit: '/100', color: 'text-accent' },
  { label: 'Sprint Risk', value: 'Medium', unit: '2d left', color: 'text-warning' },
  { label: 'Tasks Done', value: '24', unit: 'of 38', color: 'text-success' },
  { label: 'Velocity', value: '+12%', unit: 'vs last sprint', color: 'text-success' },
]

const workload = [
  { name: 'Anand', role: 'Full Stack', score: 78, color: 'bg-danger', risk: true },
  { name: 'Rohan', role: 'Backend', score: 45, color: 'bg-accent', risk: false },
  { name: 'Sneha', role: 'Frontend', score: 52, color: 'bg-success', risk: false },
  { name: 'Kiran', role: 'DevOps', score: 30, color: 'bg-accent', risk: false },
]

const activity = [
  { icon: '↑', text: 'Rohan merged PR #142', time: '2m', color: 'bg-success/10 text-success' },
  { icon: '⚡', text: 'AI flagged workload imbalance', time: '6m', color: 'bg-purple/10 text-purple' },
  { icon: '◻', text: 'Anand moved 2 tasks to Review', time: '12m', color: 'bg-accent/10 text-accent' },
  { icon: '↑', text: 'Sneha pushed 3 commits', time: '18m', color: 'bg-success/10 text-success' },
  { icon: '⚠', text: 'Sprint 7 is 62% complete', time: '1h', color: 'bg-warning/10 text-warning' },
]

export default function Dashboard() {
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
            <p className="text-muted text-sm mt-0.5">Project Atlas · Sprint 7 · 4 members online</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-success font-mono bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              Real-time engine online
            </div>
            <button className="bg-accent hover:bg-accent2 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium">
              + New Task
            </button>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-xs font-mono text-muted uppercase tracking-wider">
              // Action Required
            </div>
            <div className="bg-danger/10 text-danger text-xs font-mono px-2 py-0.5 rounded border border-danger/20">
              {actions.length} alerts
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action, i) => (
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
              <div className="text-xs text-muted font-mono uppercase tracking-wider mb-2">
                {stat.label}
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted mt-1">{stat.unit}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-4">

          {/* AI Workload — HERO */}
          <div className="bg-surface border border-accent/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-mono text-accent uppercase tracking-wider mb-0.5">
                  // AI Workload Intelligence
                </div>
                <div className="text-xs text-muted">Fairness engine · updates every 30min</div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                live
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {workload.map((member) => (
                <div key={member.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded text-xs flex items-center justify-center font-bold ${
                        member.risk ? 'bg-danger/20 text-danger' : 'bg-accent/10 text-accent'
                      }`}>
                        {member.name.charAt(0)}
                      </div>
                      <span className="text-xs text-text">{member.name}</span>
                      <span className="text-xs text-muted">· {member.role}</span>
                    </div>
                    <span className={`text-xs font-mono ${member.risk ? 'text-danger' : 'text-muted'}`}>
                      {member.score}%
                      {member.risk && ' ⚠'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${member.color} transition-all`}
                      style={{ width: `${member.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Alert */}
            <div className="p-3 bg-bg border-l-2 border-accent border border-border rounded-lg">
              <div className="text-xs text-accent font-mono uppercase tracking-wider mb-1">
                Workload imbalance detected
              </div>
              <div className="text-xs text-text2 leading-relaxed mb-2">
                Anand exceeds team average by 42%. Reassigning 2 tasks to Kiran would rebalance sprint.
              </div>
              <button className="text-xs text-accent hover:underline font-mono">
                View reassignment suggestions →
              </button>
            </div>
          </div>

          {/* Live Activity */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-mono text-muted uppercase tracking-wider">
                // Live Activity
              </div>
              <div className="flex items-center gap-1.5 text-xs text-success font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                live
              </div>
            </div>
            <div className="space-y-1.5">
              {activity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface2 transition-colors cursor-default">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-xs text-text2 leading-relaxed">{item.text}</div>
                  <div className="text-xs text-muted font-mono flex-shrink-0">{item.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sprint Status */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="text-xs font-mono text-muted uppercase tracking-wider mb-4">
              // Sprint Status
            </div>

            {/* Sprint info */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-text">Sprint 7</span>
                <span className="text-xs text-warning font-mono">2d left</span>
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden mb-1">
                <div className="h-full bg-accent rounded-full" style={{ width: '62%' }} />
              </div>
              <div className="text-xs text-muted">62% complete · 24 of 38 tasks done</div>
            </div>

            {/* Task breakdown */}
            <div className="space-y-2 mb-4">
              {[
                { label: 'Done', count: 24, color: 'bg-success' },
                { label: 'In Progress', count: 8, color: 'bg-accent' },
                { label: 'In Review', count: 4, color: 'bg-warning' },
                { label: 'Blocked', count: 2, color: 'bg-danger' },
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

            {/* Quick actions */}
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