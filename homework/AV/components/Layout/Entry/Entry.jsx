import { useState } from 'react'

import AuthForm from './AuthForm'
import RegForm from './RegForm'
//import crissIcon from '../../../../assets/cross.svg'
import './styles/entry.scss'
import Image from 'next/image'

function Entry({ isVisible, setHidden }) {
  const [isReg, setReg] = useState(false)

  return (
    <div className={`entry ${isVisible ? 'entry--visible' : 'entry--hidden'}`}>
      <button className="entry__exit">
        <Image
          src={'/cross.svg'}
          width={22}
          height={22}
          alt="exit"
          onClick={setHidden}
        />
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
