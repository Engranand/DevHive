import { useSocket } from '../hooks/useSocket'
import { useState } from 'react'
import Layout from '../components/Layout'

const initialColumns = {
  backlog: {
    id: 'backlog', title: 'Backlog', color: 'text-muted',
    tasks: [
      { id: 't1', title: 'Setup Redis caching', priority: 'high', assignee: 'AN', tag: 'backend' },
      { id: 't2', title: 'Add rate limiting', priority: 'medium', assignee: 'RO', tag: 'security' },
      { id: 't3', title: 'Write unit tests', priority: 'low', assignee: 'SN', tag: 'testing' },
    ]
  },
  in_progress: {
    id: 'in_progress', title: 'In Progress', color: 'text-warning',
    tasks: [
      { id: 't4', title: 'Workload score v2', priority: 'high', assignee: 'AN', tag: 'ai', githubPR: 141 },
      { id: 't5', title: 'Kanban DnD performance', priority: 'medium', assignee: 'SN', tag: 'ui' },
    ]
  },
  in_review: {
    id: 'in_review', title: 'In Review', color: 'text-purple',
    tasks: [
      { id: 't6', title: 'OAuth callback', priority: 'critical', assignee: 'RO', tag: 'auth', githubPR: 142, blocked: true },
    ]
  },
  done: {
    id: 'done', title: 'Done', color: 'text-success',
    tasks: [
      { id: 't7', title: 'Socket room scoping', priority: 'high', assignee: 'AN', tag: 'realtime', githubPR: 138 },
      { id: 't8', title: 'DB schema v2', priority: 'medium', assignee: 'KI', tag: 'database' },
    ]
  }
}

const priorityConfig = {
  critical: { label: 'Critical', color: 'bg-danger/10 text-danger border-danger/20' },
  high:     { label: 'High',     color: 'bg-warning/10 text-warning border-warning/20' },
  medium:   { label: 'Medium',   color: 'bg-accent/10 text-accent border-accent/20' },
  low:      { label: 'Low',      color: 'bg-muted/10 text-muted border-border' },
}

const tagColors = {
  backend: 'bg-accent/8 text-accent/70', security: 'bg-warning/8 text-warning/70',
  testing: 'bg-muted/8 text-muted', ai: 'bg-purple/8 text-purple/70',
  ui: 'bg-success/8 text-success/70', auth: 'bg-danger/8 text-danger/70',
  realtime: 'bg-accent/8 text-accent/70', database: 'bg-warning/8 text-warning/70',
}

const workloadInfo = {
  AN: { score: 78, risk: true, suggestion: 'Move to Kiran (30%)' },
  RO: { score: 45, risk: false },
  SN: { score: 52, risk: false },
  KI: { score: 30, risk: false },
}

const avatarColors = {
  AN: 'bg-accent/20 text-accent', RO: 'bg-danger/20 text-danger',
  SN: 'bg-success/20 text-success', KI: 'bg-purple/20 text-purple',
}

const filters = ['All', 'My Tasks', 'High Priority', 'Blocked', 'AI Risk']

function TaskCard({ task, onDragStart }) {
  const priority = priorityConfig[task.priority]
  const wl = workloadInfo[task.assignee] || { score: 0, risk: false }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      className={`bg-bg border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all group ${
        task.blocked ? 'border-danger/30 bg-danger/3'
        : wl.risk ? 'border-warning/20 hover:border-warning/40'
        : 'border-border hover:border-accent/30'
      }`}
    >
      {task.blocked && (
        <div className="flex items-center gap-1 mb-2 text-xs bg-danger/8 border border-danger/20 text-danger px-2 py-0.5 rounded-md w-fit font-mono">
          🚫 Blocked
        </div>
      )}
      <div className="text-sm text-text2 mb-2 leading-snug font-medium">{task.title}</div>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs text-muted font-mono">#{task.id}</span>
        <span className="text-muted">·</span>
        <span className="text-xs text-muted font-mono">Sprint 7</span>
        {task.tag && (
          <>
            <span className="text-muted">·</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${tagColors[task.tag] || 'text-muted'}`}>
              {task.tag}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded border font-mono ${priority.color}`}>
          {priority.label}
        </span>
        <div className="flex items-center gap-2">
          {task.githubPR && (
            <span className="text-xs text-success font-mono">🔗 #{task.githubPR}</span>
          )}
          <div className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${avatarColors[task.assignee] || 'bg-muted/20 text-muted'}`}>
            {task.assignee}
          </div>
          <span className={`text-xs font-mono ${wl.risk ? 'text-danger' : 'text-muted'}`}>
            {wl.score}%
          </span>
        </div>
      </div>
      {wl.risk && wl.suggestion && (
        <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5">
          <span className="text-xs text-warning font-mono">⚠ High Load</span>
          <span className="text-muted text-xs">·</span>
          <span className="text-xs text-muted font-mono">AI: Move to {wl.suggestion}</span>
        </div>
      )}
    </div>
  )
}

function Column({ column, onDragStart, onDragOver, onDrop }) {
  return (
    <div className="flex flex-col" onDragOver={onDragOver} onDrop={(e) => onDrop(e, column.id)}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${column.color}`}>
            {column.title}
          </span>
          <span className="text-xs bg-surface2 text-muted px-1.5 py-0.5 rounded font-mono border border-border">
            {column.tasks.length}
          </span>
        </div>
        <button className="w-6 h-6 rounded-md text-muted hover:text-accent hover:bg-accent/10 text-lg leading-none transition-colors flex items-center justify-center">
          +
        </button>
      </div>
      <div className="flex flex-col gap-2 min-h-64">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
        {column.tasks.length === 0 && (
          <div className="border border-dashed border-border rounded-lg p-6 text-center text-xs text-muted font-mono flex-1">
            // drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}

export default function Board() {
  const [columns, setColumns] = useState(initialColumns)
  const [draggingId, setDraggingId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')

  // Socket.io — real-time sync
  const socketRef = useSocket('project-atlas-001', (data) => {
    setColumns(prev => {
      const newCols = JSON.parse(JSON.stringify(prev))
      let movedTask = null
      for (const col of Object.values(newCols)) {
        const idx = col.tasks.findIndex(t => t.id === data.taskId)
        if (idx !== -1) {
          movedTask = col.tasks.splice(idx, 1)[0]
          break
        }
      }
      if (movedTask && newCols[data.to]) {
        newCols[data.to].tasks.push(movedTask)
      }
      return newCols
    })
  })

  const onDragStart = (e, taskId) => {
    setDraggingId(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e, targetColumnId) => {
    e.preventDefault()
    if (!draggingId) return

    const socket = socketRef.current

    setColumns(prev => {
      const newCols = JSON.parse(JSON.stringify(prev))
      let movedTask = null
      let sourceColumnId = null

      for (const col of Object.values(newCols)) {
        const idx = col.tasks.findIndex(t => t.id === draggingId)
        if (idx !== -1) {
          movedTask = col.tasks.splice(idx, 1)[0]
          sourceColumnId = col.id
          break
        }
      }

      if (movedTask) {
        newCols[targetColumnId].tasks.push(movedTask)
        if (socket && sourceColumnId !== targetColumnId) {
          socket.emit('task_moved', {
            taskId: movedTask.id,
            from: sourceColumnId,
            to: targetColumnId,
            task: movedTask,
            projectId: 'project-atlas-001'
          })
        }
      }

      return newCols
    })

    setDraggingId(null)
  }

  const totalTasks = Object.values(columns).reduce((acc, col) => acc + col.tasks.length, 0)
  const doneTasks = columns.done.tasks.length
  const blockedTasks = Object.values(columns).flatMap(c => c.tasks).filter(t => t.blocked).length
  const aiRiskTasks = Object.values(columns).flatMap(c => c.tasks).filter(t => workloadInfo[t.assignee]?.risk).length

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-muted font-mono uppercase tracking-widest mb-1">// Kanban Board</div>
            <h1 className="text-xl font-bold text-text">Project Atlas</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-muted text-sm">Sprint 7</span>
              <span className="text-muted">·</span>
              <span className="text-sm text-text2">{doneTasks}/{totalTasks} done</span>
              {blockedTasks > 0 && <><span className="text-muted">·</span><span className="text-sm text-danger">{blockedTasks} blocked</span></>}
              {aiRiskTasks > 0 && <><span className="text-muted">·</span><span className="text-sm text-warning">{aiRiskTasks} workload risk</span></>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-success font-mono bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              real-time sync
            </div>
            <button className="bg-accent hover:bg-accent2 text-white text-sm px-4 py-1.5 rounded-lg transition-colors font-medium">
              + New Task
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono border transition-colors ${
                activeFilter === filter
                  ? 'bg-accent/10 text-accent border-accent/20'
                  : 'bg-surface border-border text-muted hover:text-text hover:border-border2'
              }`}>
              {filter}
              {filter === 'Blocked' && blockedTasks > 0 && <span className="ml-1.5 bg-danger/20 text-danger px-1 rounded text-xs">{blockedTasks}</span>}
              {filter === 'AI Risk' && aiRiskTasks > 0 && <span className="ml-1.5 bg-warning/20 text-warning px-1 rounded text-xs">{aiRiskTasks}</span>}
            </button>
          ))}
          <div className="ml-auto">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text placeholder-muted focus:outline-none focus:border-accent font-mono w-52 transition-colors" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-3 mb-5 flex items-center gap-4">
          <span className="text-xs text-muted font-mono whitespace-nowrap">Sprint 7</span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${Math.round((doneTasks / totalTasks) * 100)}%` }} />
          </div>
          <span className="text-xs text-accent font-mono whitespace-nowrap">
            {Math.round((doneTasks / totalTasks) * 100)}% · 2d left
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Object.values(columns).map((column) => (
            <Column key={column.id} column={column}
              onDragStart={onDragStart} onDragOver={onDragOver} onDrop={onDrop} />
          ))}
        </div>
      </div>
    </Layout>
  )
}