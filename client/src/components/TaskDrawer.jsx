import { useState, useEffect } from 'react'
import api from '../services/api'

const priorityConfig = {
  critical: { label: 'Critical', color: 'bg-danger/10 text-danger border-danger/20' },
  high: { label: 'High', color: 'bg-warning/10 text-warning border-warning/20' },
  medium: { label: 'Medium', color: 'bg-accent/10 text-accent border-accent/20' },
  low: { label: 'Low', color: 'bg-muted/10 text-muted border-border' },
}

const statusConfig = {
  backlog: { label: 'Backlog', color: 'text-muted' },
  in_progress: { label: 'In Progress', color: 'text-warning' },
  in_review: { label: 'In Review', color: 'text-purple' },
  done: { label: 'Done', color: 'text-success' },
}

const tagColors = {
  backend: 'bg-accent/10 text-accent',
  security: 'bg-warning/10 text-warning',
  testing: 'bg-muted/10 text-muted',
  ai: 'bg-purple/10 text-purple',
  ui: 'bg-success/10 text-success',
  auth: 'bg-danger/10 text-danger',
  realtime: 'bg-accent/10 text-accent',
  database: 'bg-warning/10 text-warning',
  general: 'bg-muted/10 text-muted',
}

// Smarter AI insight — 3 states
function getAIInsight(task, daysLeft) {
  if (task.status === 'done') {
    return { icon: '✅', color: 'text-success', label: 'Completed', msg: 'Task is done. No action needed.' }
  }
  if (task.priority === 'critical' && daysLeft <= 2) {
    return { icon: '🔴', color: 'text-danger', label: 'Sprint Risk Contributor', msg: 'Critical task with sprint ending soon. Requires immediate attention.' }
  }
  if (task.status === 'in_review' && daysLeft <= 3) {
    return { icon: '🟡', color: 'text-warning', label: 'Review Delay Detected', msg: 'Task stuck in review. May impact sprint goals if not merged soon.' }
  }
  if (task.priority === 'high' && task.status === 'backlog') {
    return { icon: '🟡', color: 'text-warning', label: 'Not Started', msg: 'High priority task still in backlog. Consider moving to In Progress.' }
  }
  return { icon: '🟢', color: 'text-success', label: 'On Track', msg: 'Task is progressing normally. No action needed.' }
}

export default function TaskDrawer({ taskId, onClose, sprintDaysLeft = 0 }) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!taskId) return
    const fetchTask = async () => {
      try {
        setLoading(true)
        const { data } = await api.get(`/tasks/${taskId}`)
        setTask(data.task)
      } catch (err) {
        console.error('Failed to fetch task:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTask()
  }, [taskId])

  if (!taskId) return null

  const insight = task ? getAIInsight(task, sprintDaysLeft) : null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer — max-w-sm for better proportions */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-surface border-l border-border z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="text-xs text-muted font-mono uppercase tracking-wider">// Task Details</div>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors text-xl">✕</button>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-muted text-sm font-mono">
            Loading task...
          </div>
        ) : !task ? (
          <div className="flex-1 flex items-center justify-center text-muted text-sm font-mono">
            Task not found.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">

            {/* Title + Tag */}
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {task.priority && (
                  <span className={`text-xs px-2 py-0.5 rounded border font-mono ${priorityConfig[task.priority]?.color}`}>
                    {priorityConfig[task.priority]?.label}
                  </span>
                )}
                {task.tags?.map(tag => (
                  <span key={tag} className={`text-xs px-2 py-0.5 rounded font-mono ${tagColors[tag] || tagColors.general}`}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-lg font-bold text-text leading-snug">{task.title}</div>
            </div>

            {/* Status + Assignee */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg border border-border rounded-lg p-3">
                <div className="text-xs text-muted font-mono mb-1">Status</div>
                <span className={`text-sm font-medium ${statusConfig[task.status]?.color || 'text-muted'}`}>
                  {statusConfig[task.status]?.label || task.status}
                </span>
              </div>
              <div className="bg-bg border border-border rounded-lg p-3">
                <div className="text-xs text-muted font-mono mb-1">Assignee</div>
                {task.assignee ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">
                      {task.assignee.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-sm text-text truncate">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted">Unassigned</span>
                )}
              </div>
            </div>

            {/* Sprint Info */}
            {sprintDaysLeft !== undefined && (
              <div className="bg-bg border border-border rounded-lg p-3">
                <div className="text-xs text-muted font-mono mb-1">Sprint</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text">Sprint 7</span>
                  <span className={`text-xs font-mono ${sprintDaysLeft <= 2 ? 'text-danger' : 'text-warning'}`}>
                    {sprintDaysLeft}d left
                  </span>
                </div>
              </div>
            )}

            {/* GitHub PR */}
            {task.githubPRUrl && (
              <div className="bg-bg border border-border rounded-lg p-3">
                <div className="text-xs text-muted font-mono mb-1">GitHub PR</div>
                <a href={task.githubPRUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline">
                  🔗 PR #{task.githubPRUrl.split('/').pop()}
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ml-auto ${
                    task.status === 'done' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                  }`}>
                    {task.status === 'done' ? 'merged' : 'open'}
                  </span>
                </a>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="text-xs text-muted font-mono mb-2">Description</div>
              <div className="bg-bg border border-border rounded-lg p-3 text-sm text-text2 min-h-16">
                {task.description || <span className="text-muted italic">No description added.</span>}
              </div>
            </div>

            {/* AI Insight — Smarter */}
            {insight && (
              <div className={`border rounded-xl p-4 ${
                insight.label === 'Sprint Risk Contributor' ? 'bg-danger/5 border-danger/20' :
                insight.label === 'Review Delay Detected' || insight.label === 'Not Started' ? 'bg-warning/5 border-warning/20' :
                insight.label === 'Completed' ? 'bg-success/5 border-success/20' :
                'bg-purple/5 border-purple/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span>{insight.icon}</span>
                  <div className={`text-xs font-mono uppercase tracking-wider ${insight.color}`}>
                    {insight.label}
                  </div>
                </div>
                <div className="text-sm text-text2">{insight.msg}</div>
              </div>
            )}

            {/* Meta */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Created</span>
                <span className="font-mono">{new Date(task.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Task ID</span>
                <span className="font-mono">#{task._id.slice(-6)}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  )
}