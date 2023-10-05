import { useState } from 'react'

import './styles/reg.scss'
import { createHashPassword, isValidEmail, isValidPassword } from './utils'
function Reg() {
  const [login, setLogin] = useState('niklazq@mail.ru')
  const [password, setPassword] = useState('5034630kK@')
  const [provedPassword, setprovedPassword] = useState('5034630kK@')
  const [error, setError] = useState(null)
  const [isRegSucced, setIsRegSucced] = useState(false)

  const isValidateInput = () => {
    if (!isValidEmail(login)) {
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

  const submit = async () => {
    if (!isValidateInput()) {
      return
    }
    try {
      const response = await fetch('/api/reg', {
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
        return setIsRegSucced(true)
      }
      return setError(message)
    } catch (err) {
      return setError('Произошла ошибка.. повторите попытку позже')
    }
  }

  return isRegSucced ? (
    <div className="reg">
      <div className="reg__content">
        <span className="reg__info">{`Мы отправили ссылку активации на ${login}`}</span>
      </div>
    </div>
  ) : (
    <div className="reg">
      <div className="reg__content">
        <div className="reg__email-wrapper">
          <label className="reg__email-label label">Почта</label>
          <input
            className="reg__email input"
            type="text"
            value={login}
            onChange={(e) => {
              setLogin(e.target.value)
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
      </div>
      <div className="reg__control">
        <button
          className="reg__submit"
          disabled={!(login && password && provedPassword)}
          onClick={submit}
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  )
}

export default Reg
