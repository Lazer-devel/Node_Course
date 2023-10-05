import { useState } from 'react'

import './styles/auth.scss'
import { createHashPassword } from './utils'
import { useAuth } from '../../../hook/useAuth'

function AuthForm({ setHidden }) {
  const [login, setLogin] = useState('niklazq@mail.ru')
  const [password, setPassword] = useState('5034630kK@')
  const [error, setError] = useState(null)
  const { signIn } = useAuth()

  const submit = async () => {
    try {
      const response = await fetch('/api/auth', {
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

      const { status, message } = await response.json()

      if (status === 200) {
        setHidden()
        signIn(login)
        return
      }
      return setError(message)
    } catch (err) {
      return setError('Ошибка авторизации')
    }
  }
  return (
    <div className="auth">
      <div className="auth__content">
        <div className="auth__email-wrapper">
          <label className="auth__email-label label">Почта</label>
          <input
            className="auth__email input"
            type="text"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value)
            }}
          />
        </div>
        <div className="auth__password-wrapper ">
          <label className="auth__phone-label label">Пароль</label>
          <input
            className="auth__pass input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <span className="reg__error">{error}</span>
      </div>
      <div className="auth__control">
        <button
          className="auth__submit"
          disabled={!(password && login)}
          onClick={submit}
        >
          Войти
        </button>
      </div>
    </div>
  )
}

export default AuthForm
