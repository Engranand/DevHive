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

export default function TaskDrawer({ taskId, onClose }) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!taskId) return
    const fetchTask = async () => {
      try {
        console.log('Fetching task ID:', taskId)
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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border z-50 flex flex-col shadow-2xl">

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

            {/* Title */}
            <div>
              <div className="text-xs text-muted font-mono mb-1">Title</div>
              <div className="text-lg font-bold text-text">{task.title}</div>
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted font-mono mb-2">Status</div>
                <span className={`text-sm font-medium ${statusConfig[task.status]?.color || 'text-muted'}`}>
                  {statusConfig[task.status]?.label || task.status}
                </span>
              </div>
              <div>
                <div className="text-xs text-muted font-mono mb-2">Priority</div>
                <span className={`text-xs px-2 py-1 rounded border font-mono ${priorityConfig[task.priority]?.color || ''}`}>
                  {priorityConfig[task.priority]?.label || task.priority}
                </span>
              </div>
            </div>

            {/* Assignee */}
            <div>
              <div className="text-xs text-muted font-mono mb-2">Assignee</div>
              {task.assignee ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent/20 text-accent text-xs font-bold flex items-center justify-center">
                    {task.assignee.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm text-text">{task.assignee.name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted">Unassigned</span>
              )}
            </div>

            {/* GitHub PR Link */}
            {task.githubPRUrl && (
              <div>
                <div className="text-xs text-muted font-mono mb-2">GitHub PR</div>
                <a
                  href={task.githubPRUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent hover:underline"
                >
                  🔗 {task.githubPRUrl.split('/').slice(-2).join('#')}
                </a>
              </div>
            )}

            {/* Description */}
            <div>
              <div className="text-xs text-muted font-mono mb-2">Description</div>
              <div className="bg-bg border border-border rounded-lg p-3 text-sm text-text2 min-h-20">
                {task.description || (
                  <span className="text-muted italic">No description added.</span>
                )}
              </div>
            </div>

            {/* AI Suggestion */}
            {task.status !== 'done' && (
              <div className="bg-purple/5 border border-purple/20 rounded-xl p-4">
                <div className="text-xs text-purple font-mono uppercase tracking-wider mb-2">// AI Suggestion</div>
                <div className="text-sm text-text2">
                  {task.priority === 'critical'
                    ? '⚠ This task is critical — prioritize before sprint end.'
                    : task.priority === 'high'
                    ? '→ High priority task — ensure it moves to Review today.'
                    : '✓ Task is on track. No action needed.'}
                </div>
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