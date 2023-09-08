import { useEffect, useState } from 'react'
import Registration from './Registration'
import Authentification from './Authentification'

function Entrance() {
  const [isRegistration, setRegistration] = useState(false)

  return (
    <div className="entrance">
      <div className="entrance__content">
        {isRegistration ? (
          <Registration setRegistration={setRegistration} />
        ) : (
          <Authentification setRegistration={setRegistration} />
        )}
      </div>
    </div>
  )
}

export default Entrance
