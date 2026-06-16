import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

const navItems = [
  { path: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { path: '/board', icon: '◻', label: 'Kanban Board' },
  { path: '/sprints', icon: '▷', label: 'Sprints' },
  { path: '/github', icon: '🐙', label: 'GitHub' },
  { path: '/team', icon: '◎', label: 'Team' },
  { path: '/hive', icon: '⬡', label: 'Hive Board' },
]

export default function Sidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="w-56 h-full bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
             <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" fill="#4F8CFF"/>
             <text x="14" y="19" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">D</text>
             </svg>
          <span className="font-bold text-text">DevHive</span>
          <span className="text-xs text-muted font-mono ml-1">v1.0</span>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-0.5">
        <div className="text-xs text-muted font-mono uppercase tracking-widest px-2 py-2">
          // workspace
        </div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === item.path
                ? 'bg-accent/10 text-accent border border-accent/20'
                : 'text-muted hover:text-text hover:bg-surface2'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-text truncate">{user?.name || 'User'}</div>
            <div className="text-xs text-muted truncate">{user?.email || ''}</div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="text-muted hover:text-danger text-xs transition-colors"
            title="Logout"
          >
            ⇥
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex min-h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-accent flex items-center justify-center text-white font-bold text-xs"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            D
          </div>
          <span className="font-bold text-text text-sm">DevHive</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-muted hover:text-text text-xl transition-colors"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`md:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </div>
    </>
  )
}