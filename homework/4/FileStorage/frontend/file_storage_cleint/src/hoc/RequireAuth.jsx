import { Navigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

function RequireAuth({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={'entry/auth'} />
  }

  return children
}

export default RequireAuth
