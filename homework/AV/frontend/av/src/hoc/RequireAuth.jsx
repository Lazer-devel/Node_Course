import { Navigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

function RequireAuth({ children, cb }) {
  const { isAuth } = useAuth()

  if (!isAuth) {
    return cb()
  }

  return children
}

export default RequireAuth
