import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../store/authSlice'

const features = [
  {
    icon: '⚡',
    title: 'Real-time Collaboration',
    desc: 'Socket.io keeps every board, task, and sprint synced live across your entire team.',
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
  },
  {
    icon: '🧠',
    title: 'AI Workload Intelligence',
    desc: 'Detects contribution imbalance before burnout. Suggests reassignments automatically.',
    color: 'text-purple',
    bg: 'bg-purple/10 border-purple/20',
  },
  {
    icon: '🐙',
    title: 'GitHub Native',
    desc: 'Link PRs to tasks. Merge a PR — task closes itself. Commit heatmaps per member.',
    color: 'text-success',
    bg: 'bg-success/10 border-success/20',
  },
  {
    icon: '📊',
    title: 'Engineering Health Score',
    desc: 'One live number combining workload, velocity, sprint risk, and deadline proximity.',
    color: 'text-warning',
    bg: 'bg-warning/10 border-warning/20',
  },
]

const activity = [
  { dot: 'bg-success', text: 'PR #142 merged · task auto-closed' },
  { dot: 'bg-purple', text: 'AI: Workload imbalance detected' },
  { dot: 'bg-accent', text: 'Sprint 7 · 62% complete' },
  { dot: 'bg-warning', text: 'Anand exceeds avg by 42%' },

  {
  icon: '🧠',
  title: 'AI Workload Intelligence',
  desc: 'Detects contribution imbalance before burnout. Suggests reassignments automatically.',
  color: 'text-purple',
  bg: 'bg-purple/15 border-purple/30',
  highlight: true,
},
]

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(form))
   if (result.meta.requestStatus === 'fulfilled') navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg flex">

      {/* LEFT — Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-6">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div
              className="w-8 h-8 bg-accent flex items-center justify-center text-white font-bold text-sm"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            >
              D
            </div>
            <span className="font-bold text-lg text-text">DevHive</span>
            <span className="text-xs text-muted font-mono ml-1">v1.0</span>
          </div>

          {/* Heading */}
         <h1 className="text-2xl font-bold text-text mb-2">
  Access your engineering workspace
</h1>
<p className="text-muted text-sm">
  Sign in to DevHive · Engineering Mission Control
</p>

          {/* Error */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg p-3 mb-5 font-mono text-xs">
              ✕ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1.5 block font-mono uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-muted font-mono uppercase tracking-wider">
                  Password
                </label>
                <span className="text-xs text-accent hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent2 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in to workspace →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted font-mono">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* GitHub OAuth */}
          <button className="w-full bg-surface border border-border hover:border-border2 text-text2 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <span>🐙</span>
            Continue with GitHub
          </button>

          <p className="text-muted text-sm mt-6 text-center">
            No workspace yet?{' '}
            <Link to="/register" className="text-accent hover:underline">
              Create one free
            </Link>
          </p>

          <p className="text-center text-xs text-muted mt-8 font-mono">
            // Engineering Mission Control
          </p>
        </div>
      </div>

      {/* RIGHT — Feature Panel */}
      <div className="hidden lg:flex w-[480px] bg-surface border-l border-border flex-col p-10 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="mb-8 relative z-10">
          <div className="text-xs text-muted font-mono uppercase tracking-widest mb-2">
            // Engineering Mission Control
          </div>
          <h2 className="text-xl font-bold text-text mb-2">
            Built for teams that<br />ship serious software.
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            From early-stage startups to growing engineering organizations — DevHive keeps teams healthy, focused, and shipping.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8 relative z-10">
          {features.map((f) => (
            <div key={f.title} className={`flex items-start gap-3 p-3 rounded-lg border ${f.bg}`}>
              <div className={`text-lg flex-shrink-0 mt-0.5 ${f.color}`}>{f.icon}</div>
              <div>
                <div className={`text-sm font-medium mb-0.5 ${f.color}`}>{f.title}</div>
                <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="relative z-10 mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-xs font-mono text-muted uppercase tracking-wider">
              // Live system
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              online
            </div>
          </div>
          <div className="bg-bg border border-border rounded-lg overflow-hidden">
            {activity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border last:border-0 hover:bg-surface2 transition-colors"
              >
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                <span className="text-xs text-text2 font-mono">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Trust line */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {['bg-accent/20 text-accent', 'bg-danger/20 text-danger', 'bg-success/20 text-success', 'bg-purple/20 text-purple'].map((c, i) => (
                <div key={i} className={`w-6 h-6 rounded-full border border-surface ${c} text-xs flex items-center justify-center font-bold`}>
                  {['A', 'R', 'S', 'K'][i]}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted">
              Trusted by engineering teams
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}