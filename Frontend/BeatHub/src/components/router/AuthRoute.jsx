import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Opposite of ProtectedRoute — for pages that should only be
// accessible when NOT logged in. If already authenticated,
// redirect straight to catalog.
export default function AuthRoute({ children }) {
  const { token } = useAuth()
  return token ? <Navigate to="/catalog" replace /> : children
}