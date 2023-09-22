import { useState } from 'react'

import './styles/auth.scss'

function AuthForm() {
  const [mail, setMail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setEtt] = useState(null)

  return (
    <div className="auth">
      <div className="auth__content">
        <div className="auth__email-wrapper">
          <label className="auth__email-label label">Почта</label>
          <input
            className="auth__email input"
            type="text"
            value={mail}
            onChange={(e) => {
              setMail(e.target.value)
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
      </div>
      <div className="auth__control">
        <button
          className="auth__submit"
          disabled={!(password && mail)}
          onClick={() => 2}
        >
          Войти
        </button>
      </div>
    </div>
  )
}

export default AuthForm
