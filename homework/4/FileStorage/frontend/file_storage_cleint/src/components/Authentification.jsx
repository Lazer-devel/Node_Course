import { useState, useEffect } from 'react'
import { createHashPassword } from '../utils'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hook/useAuth'

function Authentification() {
  const [isAuthInProgress, setIsAuthInProgress] = useState(false)
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const checkToken = async () => {
      const response = await fetch('/validateToken', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.status === 200) {
        signIn('USER', () => navigate('/'))
      }
    }
    checkToken()
  }, [navigate, signIn])

  const sendAuthData = async () => {
    setIsAuthInProgress(true)
    try {
      const response = await fetch('/auth', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          login,
          password: await createHashPassword(password),
        }),
      })
      const { status, content } = await response.json()

      if (status === 'ok') {
        return signIn('USER', () => navigate('/'))
      }
      setErr(content)
    } catch (err) {
      setErr(err.message)
    }
    setIsAuthInProgress(false)
  }

  return (
    <div className="auth">
      <h2 className="auth__header">Авторизация</h2>
      <div className="auth__login-wrapper">
        <label className="auth__login-label label">Почта:</label>
        <input
          className="auth__login-input input"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
      </div>
      <div className="auth__password-wrapper">
        <label className="auth__password-label label" type="text">
          Пароль:
        </label>
        <input
          className="auth__password-input input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Link className="auth__registration-btn" to={'/entry/reg'}>
        Регистрация
      </Link>
      <span className="auth__error">{err}</span>
      <div className="auth__control-wrapper">
        <button
          className="auth__submit button"
          disabled={isAuthInProgress || !login || !password}
          onClick={sendAuthData}
        >
          Войти
        </button>
      </div>
    </div>
  )
}

export default Authentification
