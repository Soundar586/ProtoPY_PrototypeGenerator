import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code2, Eye, EyeOff, Sun, Moon } from 'lucide-react'
import toast from 'react-hot-toast'
import { register } from '../api/endpoints'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Signup() {
  const [form, setForm] = useState({ email: '', username: '', password: '', password2: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setTokens } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.username || !form.password) return toast.error('Please fill in all fields')
    if (form.password !== form.password2) return toast.error('Passwords do not match')
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters')
    setLoading(true)
    try {
      const { data } = await register(form.email, form.username, form.password, form.password2)
      setTokens(data.access, data.refresh, data.user)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err: any) {
      const errors = err.response?.data
      const msg = errors?.email?.[0] || errors?.username?.[0] || errors?.password?.[0] || 'Registration failed'
      toast.error(msg)
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
          <p className="text-[var(--muted)] text-sm">Create your free account</p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Username', key: 'username', type: 'text', placeholder: 'johndoe' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={set(key)}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm"
                />
              </div>
            ))}
            {['password', 'password2'].map((key, i) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1.5">{i === 0 ? 'Password' : 'Confirm Password'}</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form[key as keyof typeof form]}
                    onChange={set(key)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm pr-10"
                  />
                  {i === 0 && (
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-[var(--muted)] mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--primary)] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
