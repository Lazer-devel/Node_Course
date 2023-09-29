import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'
import { useEffect } from 'react'

function RequireAuth({ children }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!login) {
      navigate('/')
    }
  })

  return children
}

export default RequireAuth
