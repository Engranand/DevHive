import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'

export default function GitHubPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/github/activity')
        setData(data)
      } catch (err) {
        console.error('Failed to fetch GitHub data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="p-6 text-muted text-sm font-mono">Loading GitHub data...</div>
      </Layout>
    )
  }

  if (!data) {
    return (
      <Layout>
        <div className="p-6 text-muted text-sm font-mono">Failed to load GitHub data.</div>
      </Layout>
    )
  }

  const { repo, commits, pullRequests, autoClosedTasks, linkedTasks } = data

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <Layout>
      <div className="p-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted font-mono uppercase tracking-widest mb-1">
              // GitHub Integration
            </div>
            <h1 className="text-xl font-bold text-text">{repo.name}</h1>
            <p className="text-muted text-sm mt-0.5">{repo.description}</p>
          </div>
          <a href={repo.url} target="_blank" rel="noopener noreferrer"
            className="bg-surface border border-border hover:border-accent text-text2 text-sm px-4 py-1.5 rounded-lg transition-colors">
            🐙 View on GitHub
          </a>
        </div>

      
        {/* Engineering Stats */}
        <div className="grid grid-cols-4 gap-3">
         {[
        { label: 'Open PRs', value: pullRequests.filter(pr => pr.state === 'open').length, color: 'text-warning' },
        { label: 'Merged PRs', value: pullRequests.filter(pr => pr.state === 'merged').length, color: 'text-purple' },
        { label: 'Tasks Auto-Closed', value: autoClosedTasks.length, color: 'text-success' },
        { label: 'Linked Tasks', value: linkedTasks.length, color: 'text-accent' },
        ].map(stat => (
       <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
      <div className="text-xs text-muted font-mono uppercase tracking-wider mb-2">{stat.label}</div>
      <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
    </div>
  ))}
</div>

          {/* Recent Commits */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono text-muted uppercase tracking-wider">// Recent Commits</div>
              <div className="flex items-center gap-1.5 text-xs text-success font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                live
              </div>
            </div>
            <div className="space-y-2">
              {commits.map(commit => (
                <a key={commit.sha} href={commit.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface2 transition-colors">
                  <span className="text-xs text-accent font-mono mt-0.5">{commit.sha}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text2 truncate">{commit.message}</div>
                    <div className="text-xs text-muted mt-0.5">{commit.author} · {timeAgo(commit.date)}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Pull Requests */}
          <div className="bg-surface border border-border rounded-xl p-4">
            <div className="text-xs font-mono text-muted uppercase tracking-wider mb-3">// Pull Requests</div>
            <div className="space-y-2">
              {pullRequests.length === 0 && (
                <div className="text-sm text-muted">No pull requests yet.</div>
              )}
              {pullRequests.map(pr => (
                <a key={pr.number} href={pr.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface2 transition-colors">
                  <span className={`text-xs px-2 py-0.5 rounded border font-mono ${
                    pr.state === 'merged' ? 'bg-purple/10 text-purple border-purple/20' :
                    pr.state === 'open' ? 'bg-success/10 text-success border-success/20' :
                    'bg-danger/10 text-danger border-danger/20'
                  }`}>
                    {pr.state}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text2 truncate">#{pr.number} {pr.title}</div>
                    <div className="text-xs text-muted mt-0.5">{pr.author} · {timeAgo(pr.updatedAt)}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

      {/* Webhook Activity */}
<div className="bg-surface border border-purple/20 rounded-xl p-4">
     <div className="text-xs font-mono text-purple uppercase tracking-wider mb-3">
  // Automation Impact
</div>

  {linkedTasks.length === 0 ? (
    <div className="text-sm text-muted">No tasks linked to GitHub PRs yet.</div>
  ) : (
    <div className="space-y-2">
      {linkedTasks.map(task => {
        const prNumber = task.githubPRUrl.split('/').pop()
        return (
         <div key={task._id} className="flex items-center gap-3 p-2.5 rounded-lg bg-bg border border-border">
  <span className="text-xs text-accent font-mono">PR #{prNumber}</span>
  <span className="text-muted">→</span>
  <span className="text-sm text-text2 flex-1">{task.title}</span>
  {task.status === 'done' ? (
    <span className="text-xs text-muted font-mono">in_review → done</span>
  ) : (
    <span className="text-xs text-muted font-mono">awaiting merge</span>
  )}
  <span className={`text-xs px-2 py-0.5 rounded border font-mono ${
    task.status === 'done'
      ? 'bg-success/10 text-success border-success/20'
      : 'bg-warning/10 text-warning border-warning/20'
  }`}>
    {task.status === 'done' ? '✓ task closed' : task.status}
  </span>
</div>
        )
      })}
    </div>
  )}

  <div className="mt-3 pt-3 border-t border-border text-xs text-muted">
    When a linked PR merges, DevHive automatically moves the task to <span className="text-success">Done</span> and broadcasts the update via Socket.io — no manual action needed.
  </div>
</div>

    </Layout>
  )
}