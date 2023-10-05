import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [login, setLogin] = useState('')
  const router = useRouter()

  useEffect(() => {
    const auth = async () => {
      const response = await fetch('/api/isAuthorized', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.status === 200) {
        return setLogin(await response.json())
      }
      router.push('/')
    }

    auth()
  }, [])

  const signIn = (login) => {
    setLogin(login)
  }

  const value = { login, signIn }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
