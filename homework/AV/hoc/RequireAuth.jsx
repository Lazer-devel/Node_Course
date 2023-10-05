import { useRouter } from 'next/router'
import { useAuth } from '../hook/useAuth'
import { useEffect } from 'react'

function RequireAuth({ children }) {
  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!login) {
      router.push('/')
    }
  })

  return children
}

export default RequireAuth
