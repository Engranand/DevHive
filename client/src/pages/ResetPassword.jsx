import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, newPassword: password })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-8 text-center">
          <div className="text-danger text-2xl mb-3">✕</div>
          <h1 className="text-lg font-semibold text-text mb-2">Invalid Link</h1>
          <p className="text-muted text-sm mb-4">This password reset link is missing or invalid.</p>
          <Link to="/forgot-password" className="text-accent hover:underline text-sm">
            Request a new link →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="flex items-center gap-2 mb-8 justify-center">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" fill="#4F8CFF"/>
            <text x="14" y="19" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">D</text>
          </svg>
          <span className="font-bold text-xl text-text">DevHive</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          {success ? (
            <>
              <div className="text-success text-2xl mb-3">✓</div>
              <h1 className="text-lg font-semibold text-text mb-1">Password reset!</h1>
              <p className="text-muted text-sm">Redirecting you to login...</p>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold text-text mb-1">Set new password</h1>
              <p className="text-muted text-sm mb-6">Choose a strong password for your account.</p>

              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg p-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted mb-1.5 block">New Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent2 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Resetting...' : 'Reset password →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}