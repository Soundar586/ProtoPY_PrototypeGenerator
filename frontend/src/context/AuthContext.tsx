import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getMe, logout as apiLogout } from '../api/endpoints'

interface User { id: number; email: string; username: string }

interface AuthCtx {
  user: User | null
  loading: boolean
  setTokens: (access: string, refresh: string, user: User) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthCtx>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const access = localStorage.getItem('access')
    if (access) {
      getMe()
        .then((r) => setUser(r.data))
        .catch(() => {
          localStorage.clear()
          setLoading(false)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const setTokens = (access: string, refresh: string, user: User) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
    setUser(user)
  }

  const logout = async () => {
    const refresh = localStorage.getItem('refresh') || ''
    try { await apiLogout(refresh) } catch {}
    localStorage.clear()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, setTokens, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
