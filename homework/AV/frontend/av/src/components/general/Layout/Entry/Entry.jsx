import { useState } from 'react'

import AuthForm from './AuthForm'
import RegForm from './RegForm'
import crissIcon from '../../../../assets/cross.svg'
import './styles/entry.scss'

function Entry({ isVisible, setHidden }) {
  const [isReg, setReg] = useState(false)

  return (
    <div className={`entry ${isVisible ? 'entry--visible' : 'entry--hidden'}`}>
      <button className="entry__exit">
        <img src={crissIcon} alt="exit" onClick={setHidden} />
      </button>
      <div className="entry__content">
        <h2 className="entry__header"> {isReg ? 'Регистрация' : 'Вход'}</h2>
        <div className="entry__method">
          <span className="entry__mail-entry">по почте</span>
        </div>
        {isReg ? <RegForm /> : <AuthForm setHidden={setHidden} />}
        <div className="entry__toogle" onClick={() => setReg((prev) => !prev)}>
          {isReg ? 'Вход' : 'Регистрация'}
        </div>
      </div>
    </div>
  )
}

export default Entry
