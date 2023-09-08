import { useState } from 'react'

function Registration({ setRegistration }) {
  const [password, setPassword] = useState('')
  const [provePassword, setProvePassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('fasfas')

  const nextStep = () => {
    const lowerChar = /(?=.*[a-z])/
    const upperChar = /(?=.*[A-Z])/
    const numericChar = /(?=.*[0-9])/
    const specChar = /(?=.*[!@#$%^&*])/
    const length = /(?=.{8,})/

    const passRegex = new RegExp(
      `^${lowerChar.source}${upperChar.source}${numericChar.source}${specChar.source}${length.source}`
    )

    const emailRegex = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
    )

    if (!emailRegex.test(email)) {
      setError('Неверно указана почта ')
      return
    }

    if (!passRegex.test(password)) {
      setError('Пароль должен состоять не менее чем из 8 символов и содержать')
      return
    }

    if (password !== provePassword) {
      setError('Пароли не совпадают!')
      setPassword('')
      setProvePassword('')
    }
  }

  return (
    <>
      <h2 className="reg__header">Регистрация</h2>
      <input
        className="reg__email input"
        type="text"
        placeholder="Почта"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="reg__pass input"
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="reg__prove-pass input"
        type="password"
        placeholder="Подтвердите пароль"
        value={provePassword}
        onChange={(e) => setProvePassword(e.target.value)}
      />
      <span className="reg__error">{error}</span>
      <div className="reg__control-wrapper">
        <button
          className="reg__submit button"
          onClick={() => setRegistration(false)}
        >
          Назад
        </button>
        <button
          className="auth__submit button"
          disabled={!(email && password && provePassword)}
          onClick={nextStep}
        >
          Далее
        </button>
      </div>
    </>
  )
}

export default Registration
