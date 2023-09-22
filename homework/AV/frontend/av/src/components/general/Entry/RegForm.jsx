import { useState } from 'react'

import './styles/reg.scss'
import { createHashPassword, isValidEmail, isValidPassword } from './utils'
function Reg() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [provedPassword, setprovedPassword] = useState('')
  const [error, setError] = useState(null)

  const isValidateInput = () => {
    if (!isValidEmail(email)) {
      setError('Неверно указана почта ')
      return false
    }

    if (!isValidPassword(password)) {
      setError('Пароль должен состоять не менее чем из 8 символов и содержать')
      return false
    }

    if (password !== provedPassword) {
      setError('Пароли не совпадают!')
      setPassword('')
      setprovedPassword('')
      return false
    }
    return true
  }

  const regHandle = async () => {
    if (!isValidateInput()) {
      return
    }
    try {
      const response = await fetch('/reg', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: await createHashPassword(password),
        }),
      })
      if (response.status !== 200) {
        setError('Произошла ошбика.. повторите попытку позже')
      }
    } catch (err) {
      setError('Произошла ошбика.. повторите попытку позже')
    }
  }

  return (
    <div className="reg">
      <div className="reg__content">
        <div className="reg__email-wrapper">
          <label className="reg__email-label label">Почта</label>
          <input
            className="reg__email input"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </div>
        <div className="reg__password-wrapper ">
          <label className="reg__phone-label label">Пароль</label>
          <input
            className="reg__pass input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <div className="reg__prove-password-wrapper ">
          <label className="reg__prove-password-label label">
            Подтвердите пароль
          </label>
          <input
            className="reg__pass input"
            type="password"
            value={provedPassword}
            onChange={(e) => {
              setprovedPassword(e.target.value)
            }}
          />
        </div>
        <span className="reg__error">{error}</span>
        <span className="reg__info">
          Мы отправим письмо на указанную почту со ссылкой на страницу
          активации.
        </span>
      </div>
      <div className="reg__control">
        <button
          className="reg__submit"
          disabled={!(email && password && provedPassword)}
          onClick={regHandle}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  )
}

export default Reg
