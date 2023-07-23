import 'react-dropdown/style.css'
import './App.scss'

import ReqConstructor from './components/req-constructor/ReqConstructor'

function App() {
  return (
    <div className="content">
      <ReqConstructor />
      <div className="request-response"></div>
    </div>
  )
}

export default App
