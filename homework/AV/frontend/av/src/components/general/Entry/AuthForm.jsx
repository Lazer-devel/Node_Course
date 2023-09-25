import { useState } from 'react'

import './styles/auth.scss'
import { createHashPassword } from './utils'

function AuthForm({ setHidden, setUserName }) {
  const [login, setLogin] = useState('niklazq@mail.ru')
  const [password, setPassword] = useState('5034630kK@')
  const [error, setError] = useState(null)

  const submit = async () => {
    try {
      const response = await fetch('http://localhost:55555/auth', {
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
        setHidden()
        return setUserName(login)
      }
      return setError(content)
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
