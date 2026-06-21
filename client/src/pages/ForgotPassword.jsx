import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [devToken, setDevToken] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setSubmitted(true)
      // MVP — dev token dikhao (email system aane tak)
      if (data.devToken) setDevToken(data.devToken)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" fill="#4F8CFF"/>
            <text x="14" y="19" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">D</text>
          </svg>
          <span className="font-bold text-xl text-text">DevHive</span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8">
          {!submitted ? (
            <>
              <h1 className="text-lg font-semibold text-text mb-1">Reset your password</h1>
              <p className="text-muted text-sm mb-6">Enter your email and we'll send you a reset link.</p>

              {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-lg p-3 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Email</label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent hover:bg-accent2 text-white py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send reset link →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-success text-2xl mb-3">✓</div>
              <h1 className="text-lg font-semibold text-text mb-1">Check your email</h1>
              <p className="text-muted text-sm mb-4">
                If an account exists for <span className="text-text">{email}</span>, you'll receive a reset link shortly.
              </p>

            
            </>
          )}

          <p className="text-muted text-sm mt-4 text-center">
            Remember your password?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}