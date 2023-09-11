import { useEffect, useState } from 'react'
import Registration from './Registration'
import Authentification from './Authentification'
import { entranceState } from '../constants'

function Entrance() {
  const [contentType, setContentType] = useState(entranceState.auth)

  const createContent = () => {
    switch (contentType) {
      case entranceState.auth:
        return <Authentification setEntranceState={setContentType} />
      case entranceState.reg:
        return <Registration setEntranceState={setContentType} />
      default:
        throw new Error('invalid content')
    }
  }
  return (
    <div className="entrance">
      <div className="entrance__content">{createContent()}</div>
    </div>
  )
}

export default Entrance
