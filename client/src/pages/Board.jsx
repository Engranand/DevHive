 import { useSocket } from '../hooks/useSocket'
import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import TaskDrawer from '../components/TaskDrawer'

const PROJECT_ID = '6a2c7ce76ec1258f7b8e9357'

const initialColumns = {
  backlog: { id: 'backlog', title: 'Backlog', color: 'text-muted', tasks: [] },
  in_progress: { id: 'in_progress', title: 'In Progress', color: 'text-warning', tasks: [] },
  in_review: { id: 'in_review', title: 'In Review', color: 'text-purple', tasks: [] },
  done: { id: 'done', title: 'Done', color: 'text-success', tasks: [] },
}

const priorityConfig = {
  critical: { label: 'Critical', color: 'bg-danger/10 text-danger border-danger/20' },
  high: { label: 'High', color: 'bg-warning/10 text-warning border-warning/20' },
  medium: { label: 'Medium', color: 'bg-accent/10 text-accent border-accent/20' },
  low: { label: 'Low', color: 'bg-muted/10 text-muted border-border' },
}

const tagColors = {
  backend: 'bg-accent/8 text-accent/70', security: 'bg-warning/8 text-warning/70',
  testing: 'bg-muted/8 text-muted', ai: 'bg-purple/8 text-purple/70',
  ui: 'bg-success/8 text-success/70', auth: 'bg-danger/8 text-danger/70',
  realtime: 'bg-accent/8 text-accent/70', database: 'bg-warning/8 text-warning/70',
  general: 'bg-muted/8 text-muted',
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

function TaskCard({ task, onDragStart, onTaskClick }) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const wl = workloadInfo[task.assignee] || { score: 0, risk: false }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onTaskClick(task.id)}
      className={`bg-bg border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all ${
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
      <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
        <span className="text-xs text-muted font-mono">#{task.shortId || task.id}</span>
        <span className="text-muted">·</span>
        <span className="text-xs text-muted font-mono">Sprint 7</span>
        {task.tag && (
          <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${tagColors[task.tag] || 'text-muted'}`}>
            {task.tag}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded border font-mono ${priority.color}`}>
          {priority.label}
        </span>
        <div className="flex items-center gap-2">
          {task.githubPR && <span className="text-xs text-success font-mono">🔗 #{task.githubPR}</span>}
          <div className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center ${avatarColors[task.assignee] || 'bg-muted/20 text-muted'}`}>
            {task.assignee}
          </div>
          <span className={`text-xs font-mono ${wl.risk ? 'text-danger' : 'text-muted'}`}>{wl.score}%</span>
        </div>
      </div>
      {wl.risk && wl.suggestion && (
        <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-warning font-mono">⚠ High Load</span>
          <span className="text-muted text-xs">·</span>
          <span className="text-xs text-muted font-mono">AI: Move to {wl.suggestion}</span>
        </div>
      )}
    </div>
  )
}

function Column({ column, onDragStart, onDragOver, onDrop, onTaskClick }) {
  return (
    <div className="flex flex-col min-w-0" onDragOver={onDragOver} onDrop={(e) => onDrop(e, column.id)}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-semibold uppercase tracking-wider ${column.color}`}>
            {column.title}
          </span>
          <span className="text-xs bg-surface2 text-muted px-1.5 py-0.5 rounded font-mono border border-border">
            {column.tasks.length}
          </span>
        </div>
        <button className="w-6 h-6 rounded-md text-muted hover:text-accent hover:bg-accent/10 text-lg leading-none transition-colors flex items-center justify-center">+</button>
      </div>
      <div className="flex flex-col gap-2 min-h-32">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDragStart={onDragStart} onTaskClick={onTaskClick} />
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
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [members, setMembers] = useState([])
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', assignee: '', status: 'backlog' })
  const [selectedTaskId, setSelectedTaskId] = useState(null)

  const socketRef = useSocket(PROJECT_ID, (data) => {
    setColumns(prev => {
      const newCols = JSON.parse(JSON.stringify(prev))
      let movedTask = null
      for (const col of Object.values(newCols)) {
        const idx = col.tasks.findIndex(t => t.id === data.taskId)
        if (idx !== -1) { movedTask = col.tasks.splice(idx, 1)[0]; break }
      }
      if (movedTask && newCols[data.to]) newCols[data.to].tasks.push(movedTask)
      return newCols
    })
  })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get(`/tasks?projectId=${PROJECT_ID}`)
        const grouped = {
          backlog: { id: 'backlog', title: 'Backlog', color: 'text-muted', tasks: [] },
          in_progress: { id: 'in_progress', title: 'In Progress', color: 'text-warning', tasks: [] },
          in_review: { id: 'in_review', title: 'In Review', color: 'text-purple', tasks: [] },
          done: { id: 'done', title: 'Done', color: 'text-success', tasks: [] },
        }
        data.tasks.forEach(task => {
          const initials = task.assignee?.name ? task.assignee.name.slice(0, 2).toUpperCase() : '??'
          const formattedTask = {
            id: task._id, shortId: task._id.slice(-4),
            title: task.title, priority: task.priority,
            assignee: initials, tag: task.priority === 'critical' ? 'auth' : 'general',
            githubPR: task.githubPRUrl ? task.githubPRUrl.split('/').pop() : null,
            blocked: task.status === 'in_review' && task.priority === 'critical',
          }
          if (grouped[task.status]) grouped[task.status].tasks.push(formattedTask)
        })
        setColumns(grouped)
      } catch (err) { console.error('Failed to fetch tasks:', err) }
      finally { setLoading(false) }
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await api.get(`/projects/${PROJECT_ID}`)
        setMembers(data.project.members.map(m => ({
          id: m.user._id, name: m.user.name,
          initials: m.user.name.slice(0, 2).toUpperCase()
        })))
      } catch (err) { console.error('Failed to fetch members:', err) }
    }
    fetchMembers()
  }, [])

  const onDragStart = (e, taskId) => { setDraggingId(taskId); e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  const onDrop = (e, targetColumnId) => {
    e.preventDefault()
    if (!draggingId) return
    const socket = socketRef.current
    setColumns(prev => {
      const newCols = JSON.parse(JSON.stringify(prev))
      let movedTask = null, sourceColumnId = null
      for (const col of Object.values(newCols)) {
        const idx = col.tasks.findIndex(t => t.id === draggingId)
        if (idx !== -1) { movedTask = col.tasks.splice(idx, 1)[0]; sourceColumnId = col.id; break }
      }
      if (movedTask) {
        newCols[targetColumnId].tasks.push(movedTask)
        if (socket && sourceColumnId !== targetColumnId) {
          socket.emit('task_moved', { taskId: movedTask.id, from: sourceColumnId, to: targetColumnId, task: movedTask, projectId: PROJECT_ID })
        }
        if (sourceColumnId !== targetColumnId) {
          api.patch(`/tasks/${movedTask.id}`, { status: targetColumnId }).catch(err => console.error(err))
        }
      }
      return newCols
    })
    setDraggingId(null)
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return
    try {
      const { data } = await api.post('/tasks', { project: PROJECT_ID, title: newTask.title, priority: newTask.priority, status: newTask.status, assignee: newTask.assignee || undefined })
      const assigneeInitials = data.task.assignee?.name ? data.task.assignee.name.slice(0, 2).toUpperCase() : '??'
      const formattedTask = { id: data.task._id, shortId: data.task._id.slice(-4), title: data.task.title, priority: data.task.priority, assignee: assigneeInitials, tag: 'general' }
      setColumns(prev => { const newCols = JSON.parse(JSON.stringify(prev)); newCols[newTask.status].tasks.push(formattedTask); return newCols })
      setNewTask({ title: '', priority: 'medium', assignee: '', status: 'backlog' })
      setShowModal(false)
    } catch (err) { console.error('Failed to create task:', err) }
  }

  const totalTasks = Object.values(columns).reduce((acc, col) => acc + col.tasks.length, 0)
  const doneTasks = columns.done.tasks.length
  const blockedTasks = Object.values(columns).flatMap(c => c.tasks).filter(t => t.blocked).length
  const aiRiskTasks = Object.values(columns).flatMap(c => c.tasks).filter(t => workloadInfo[t.assignee]?.risk).length

  return (
    <Layout>
      <div className="p-4 md:p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-3">
          <div>
            <div className="text-xs text-muted font-mono uppercase tracking-widest mb-1">// Kanban Board</div>
            <h1 className="text-xl font-bold text-text">Project Atlas</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-sm">
              <span className="text-muted">Sprint 7</span>
              <span className="text-muted">·</span>
              <span className="text-text2">{doneTasks}/{totalTasks} done</span>
              {blockedTasks > 0 && <><span className="text-muted">·</span><span className="text-danger">{blockedTasks} blocked</span></>}
              {aiRiskTasks > 0 && <><span className="text-muted">·</span><span className="text-warning">{aiRiskTasks} workload risk</span></>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-success font-mono bg-success/10 border border-success/20 px-3 py-1.5 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
              real-time sync
            </div>
            <button onClick={() => setShowModal(true)} className="bg-accent hover:bg-accent2 text-white text-sm px-3 py-1.5 rounded-lg transition-colors font-medium whitespace-nowrap">
              + New Task
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono border transition-colors whitespace-nowrap flex-shrink-0 ${
                activeFilter === filter ? 'bg-accent/10 text-accent border-accent/20' : 'bg-surface border-border text-muted hover:text-text'
              }`}>
              {filter}
              {filter === 'Blocked' && blockedTasks > 0 && <span className="ml-1.5 bg-danger/20 text-danger px-1 rounded text-xs">{blockedTasks}</span>}
              {filter === 'AI Risk' && aiRiskTasks > 0 && <span className="ml-1.5 bg-warning/20 text-warning px-1 rounded text-xs">{aiRiskTasks}</span>}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..." className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text placeholder-muted focus:outline-none focus:border-accent font-mono w-28 sm:w-52 transition-colors" />
          </div>
        </div>

        {/* Sprint Progress */}
        <div className="bg-surface border border-border rounded-xl p-3 mb-5 flex items-center gap-4">
          <span className="text-xs text-muted font-mono whitespace-nowrap">Sprint 7</span>
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${Math.round((doneTasks / totalTasks) * 100)}%` }} />
          </div>
          <span className="text-xs text-accent font-mono whitespace-nowrap">{Math.round((doneTasks / totalTasks) * 100)}% · 2d left</span>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(columns).map((column) => (
            <Column
              key={column.id}
              column={column}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onTaskClick={setSelectedTaskId}
            />
          ))}
        </div>

        {/* New Task Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-xl p-5 w-full max-w-md">
              <h2 className="text-lg font-bold text-text mb-4">Create New Task</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted font-mono mb-1 block">Title</label>
                  <input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g. Fix login bug"
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-muted focus:outline-none focus:border-accent" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted font-mono mb-1 block">Priority</label>
                    <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted font-mono mb-1 block">Status</label>
                    <select value={newTask.status} onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                      <option value="backlog">Backlog</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted font-mono mb-1 block">Assignee</label>
                  <select value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent">
                    <option value="">Unassigned</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setShowModal(false)} className="flex-1 bg-surface2 hover:bg-border text-text2 text-sm px-4 py-2 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleCreateTask} className="flex-1 bg-accent hover:bg-accent2 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">Create Task</button>
              </div>
            </div>
          </div>
        )}

        {/* Task Drawer */}
        <TaskDrawer
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />

      </div>
    </Layout>
  )
}