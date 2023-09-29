import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [login, setLogin] = useState('')
  const navigator = useNavigate()

  useEffect(() => {
    const auth = async () => {
      const response = await fetch('http://localhost:55555/checkAuth', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.status === 200) {
        return setLogin(await response.json())
      }
      navigator('/')
    }

    auth()
  }, [navigator])

  const signIn = (login) => {
    setLogin(login)
  }

  const value = { login, signIn }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
