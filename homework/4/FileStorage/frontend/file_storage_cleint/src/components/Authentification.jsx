import { useState } from 'react'
import bcrypt from 'bcryptjs'

function Authentification({ setRegistration }) {
  const [isAuthinProgress, setAuthProgress] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const sendAuthData = async () => {
    setAuthProgress(true)
    let passHash

    try {
      passHash = await bcrypt.hash(password, 10)
    } catch (err) {
      alert(err.message)
    }

    try {
      const response = await fetch('http://localhost:1004/auth', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: passHash,
        }),
      })
      const token = await response.json()
    } catch (err) {
      alert(err.message)
    }
  }
  return (
    <>
      <h2 className="auth__header">Авторизация</h2>
      <div className="auth__login-wrapper">
        <label className="auth__login-label label">Почта:</label>
        <input
          className="auth__login-input input"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <span
        className="auth__registration-btn"
        onClick={() => setRegistration(true)}
      >
        Регистрация
      </span>
      <div className="auth__control-wrapper">
        <button
          className="auth__submit button"
          disabled={isAuthinProgress || !email || !password}
          onClick={sendAuthData}
        >
          Войти
        </button>
      </div>
    </>
  )
}

export default Authentification
