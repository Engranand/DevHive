import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setActiveProject } from '../store/authSlice'
import api from '../services/api'

export default function CreateProject() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [step, setStep] = useState(1) // 1: Create, 2: Invite
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [project, setProject] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
  })

  const [inviteEmail, setInviteEmail] = useState('')
  const [invites, setInvites] = useState([])
  const [inviteError, setInviteError] = useState('')

  const handleCreateProject = async () => {
    if (!form.name.trim()) {
      setError('Project name is required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/projects', {
        name: form.name,
        description: form.description,
      })
      setProject(data.project)
      dispatch(setActiveProject(data.project))
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

 const handleAddInvite = async () => {
  if (!inviteEmail.trim()) return
  if (!inviteEmail.includes('@')) {
    setInviteError('Enter a valid email')
    return
  }
  if (invites.includes(inviteEmail)) {
    setInviteError('Already added')
    return
  }

  try {
    // Actual backend call — invitation record banegi
    await api.post('/invitations', {
      projectId: project._id,
      email: inviteEmail,
      role: 'contributor',
    })
    setInvites([...invites, inviteEmail])
    setInviteEmail('')
    setInviteError('')
  } catch (err) {
    setInviteError(err.response?.data?.message || 'Failed to send invite')
  }
}

 const handleFinish = async () => {
  navigate('/dashboard')
}
  

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" fill="#4F8CFF"/>
            <text x="14" y="19" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">D</text>
          </svg>
          <span className="font-bold text-text text-lg">DevHive</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-accent text-white' : 'bg-surface text-muted border border-border'
          }`}>1</div>
          <div className={`flex-1 h-px max-w-12 ${step >= 2 ? 'bg-accent' : 'bg-border'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-accent text-white' : 'bg-surface text-muted border border-border'
          }`}>2</div>
        </div>

        {/* Step 1 — Create Project */}
        {step === 1 && (
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">// Step 1 of 2</div>
            <h1 className="text-xl font-bold text-text mb-1">Create your project</h1>
            <p className="text-muted text-sm mb-6">This will be your team's workspace in DevHive.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted font-mono mb-1.5 block">Project Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Project Atlas, My Startup"
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                />
              </div>

              <div>
                <label className="text-xs text-muted font-mono mb-1.5 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What are you building?"
                  rows={3}
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                onClick={handleCreateProject}
                disabled={loading}
                className="w-full bg-accent hover:bg-accent2 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Project →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Invite Members */}
        {step === 2 && (
          <div className="bg-surface border border-border rounded-2xl p-6">
            <div className="text-xs text-muted font-mono uppercase tracking-wider mb-1">// Step 2 of 2</div>
            <h1 className="text-xl font-bold text-text mb-1">Invite your team</h1>
            <p className="text-muted text-sm mb-1">
              Project <span className="text-accent font-medium">"{project?.name}"</span> created! 🎉
            </p>
            <p className="text-muted text-sm mb-6">Add teammates to collaborate in real-time.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted font-mono mb-1.5 block">Email Address</label>
                <div className="flex gap-2">
                  <input
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInvite()}
                    placeholder="teammate@email.com"
                    className="flex-1 bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    onClick={handleAddInvite}
                    className="bg-surface2 hover:bg-border text-text text-sm px-4 py-2.5 rounded-lg transition-colors border border-border"
                  >
                    Add
                  </button>
                </div>
                {inviteError && <p className="text-xs text-danger mt-1">{inviteError}</p>}
              </div>

              {/* Invited list */}
              {invites.length > 0 && (
                <div className="space-y-2">
                  {invites.map((email, i) => (
                    <div key={i} className="flex items-center justify-between bg-bg border border-border rounded-lg px-3 py-2">
                      <span className="text-sm text-text2">{email}</span>
                      <button
                        onClick={() => setInvites(invites.filter((_, idx) => idx !== i))}
                        className="text-muted hover:text-danger text-xs transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-surface2 hover:bg-border text-text2 text-sm py-2.5 rounded-lg transition-colors border border-border"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-accent hover:bg-accent2 text-white text-sm py-2.5 rounded-lg transition-colors font-medium"
                >
                  Go to Dashboard →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-4">
          You can invite more members later from Team settings.
        </p>

      </div>
    </div>
  )
}