import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { login } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setTokens } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')
    setLoading(true)
    try {
      const { data } = await login(email, password)
      setTokens(data.access, data.refresh, data.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <button onClick={toggle} className="fixed top-4 right-4 p-2 rounded-lg hover:bg-[var(--card)] transition-colors">
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[var(--primary)] font-bold text-2xl mb-2">
            <Code2 size={28} /> ProtoPy
          </Link>
          <p className="text-[var(--muted)] text-sm">Sign in to your account</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-[var(--muted)] mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[var(--primary)] font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
