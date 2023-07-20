import 'react-dropdown/style.css'
import './App.scss'

import ReqConstructor from './components/req-constructor/ReqConstructor'
import SavedRequests from './components/SavedRequests'
import { useState } from 'react'

function App() {
  const [savedReq, setSavedReq] = useState([])
  console.log(savedReq)
  return (
    <div className="container">
      <SavedRequests savedReq={savedReq} />
      <ReqConstructor setSavedReq={setSavedReq} />
      <div className="request-response"></div>
    </div>
  )
}

export default App
