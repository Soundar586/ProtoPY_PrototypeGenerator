import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen text-[var(--muted)]">Loading...</div>
  return user ? children : <Navigate to="/login" replace />
}
