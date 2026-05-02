import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRole && user?.role !== allowedRole) {
    const redirectMap = { ADMIN: '/admin', CONDUCTOR: '/conductor', APODERADO: '/apoderado' }
    return <Navigate to={redirectMap[user?.role] || '/login'} replace />
  }
  return children
}
