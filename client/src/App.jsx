import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from './store/authSlice'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Board from './pages/Board'
import Sprints from './pages/Sprints'
import GitHubPage from './pages/Github'
import Team from './pages/Team'
import CreateProject from './pages/CreateProject'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
function RedirectToLanding() {
  useEffect(() => {
    window.location.replace('/landing.html')
  }, [])
  return null
}

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)
  return token ? children : <Navigate to="/login" />
}

const ProjectRoute = ({ children }) => {
  const { token, hasProject } = useSelector((state) => state.auth)
  if (!token) return <Navigate to="/login" />
  if (!hasProject) return <Navigate to="/create-project" />
  return children
}

export default function App() {
  const dispatch = useDispatch()
  const { token, authChecked } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      dispatch(checkAuth())
    }
  }, [])

  // Token hai but auth check abhi complete nahi hua — wait karo
  if (token && !authChecked) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-muted text-sm font-mono">Loading workspace...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<RedirectToLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/create-project" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
      <Route path="/dashboard" element={<ProjectRoute><Dashboard /></ProjectRoute>} />
      <Route path="/board" element={<ProjectRoute><Board /></ProjectRoute>} />
      <Route path="/sprints" element={<ProjectRoute><Sprints /></ProjectRoute>} />
      <Route path="/github" element={<ProjectRoute><GitHubPage /></ProjectRoute>} />
      <Route path="/team" element={<ProjectRoute><Team /></ProjectRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}