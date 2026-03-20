import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut, Code2 } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-[var(--primary)]">
          <Code2 size={22} /> ProtoPy
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-[var(--card)] transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-red-500 transition-colors">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-[var(--primary)] transition-colors">Login</Link>
              <Link to="/signup" className="text-sm font-medium bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
