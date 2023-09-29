import { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false)
  const signIn = (cb) => {
    setIsAuth(true)
    cb()
  }

  const signOut = (cb) => {
    setIsAuth(false)
    cb()
  }

  const value = { isAuth, signIn, signOut }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
