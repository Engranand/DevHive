import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { register, clearError } from '../store/authSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(register(form))
    if (result.meta.requestStatus === 'fulfilled') navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-accent flex items-center justify-center text-white font-bold text-sm"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            D
          </div>
          <span className="font-bold text-xl text-text">DevHive</span>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-xl p-8">
          <h1 className="text-lg font-semibold text-text mb-1">Create your workspace</h1>
          <p className="text-muted text-sm mb-6">Start building with your team today</p>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted mb-1.5 block">Full name</label>
              <input
                type="text"
                placeholder="Anand Raj"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@company.com"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-muted mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent2 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create workspace →'}
            </button>
          </form>

          <p className="text-muted text-sm mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted mt-4 font-mono">
          // Engineering Mission Control
        </p>
      </div>
    </div>
  )
}