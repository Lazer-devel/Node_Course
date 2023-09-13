import { useState } from 'react'
import { isValidPassword, isValidEmail, createHashPassword } from '../utils'
import { useNavigate } from 'react-router-dom'
import LinkButton from './LinkButton'

function Registration() {
  const [password, setPassword] = useState('')
  const [provePassword, setProvePassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isFirstStep, setFirstStep] = useState(true)
  const navigate = useNavigate()

  const isValidateInput = () => {
    if (!isValidEmail(email)) {
      setError('Неверно указана почта ')
      return false
    }

    if (!isValidPassword(password)) {
      setError('Пароль должен состоять не менее чем из 8 символов и содержать')
      return false
    }

    if (password !== provePassword) {
      setError('Пароли не совпадают!')
      setPassword('')
      setProvePassword('')
      return false
    }
    return true
  }

  const prepareRegData = async () => {
    return JSON.stringify({
      email,
      password: await createHashPassword(password),
    })
  }

  const sendRegReq = async () => {
    if (!isValidateInput()) {
      return
    }
    const response = await fetch('/reg', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: await prepareRegData(password),
    })

    const { status, content } = await response.json()

    if (status === 'err') {
      setError(content)
      return
    }
    setFirstStep(false)
  }

  const createFirstStep = () => (
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
      <div className="reg__control-wrapper reg__control-wrapper--spaces">
        <button className="reg__submit button" onClick={() => navigate(-1)}>
          Назад
        </button>
        <button
          className="auth__submit button"
          disabled={!(email && password && provePassword)}
          onClick={sendRegReq}
        >
          Далее
        </button>
      </div>
    </>
  )

  return (
    <div className="reg">
      {isFirstStep ? (
        createFirstStep()
      ) : (
        <>
          <h2 className="reg__header">{`Письмо было отправлено на ${email}`}</h2>
          <div className="reg__control-wrapper">
            <LinkButton
              to={'/entry/auth'}
              className={'reg__confirm'}
              text={'OK'}
            />
          </div>
        </>
      )}
    </div>
  )
}
export default Registration
