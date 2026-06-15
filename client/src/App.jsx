import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Board from './pages/Board'
import Sprints from './pages/Sprints'
import GitHubPage from './pages/Github'

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RedirectToLanding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>} />
      <Route path="/sprints" element={<PrivateRoute><Sprints /></PrivateRoute>} />
      <Route path="/github" element={<PrivateRoute><GitHubPage /></PrivateRoute>} />
    </Routes>
  )
}