import { useState } from 'react'
import './App.scss'
import 'animate.css'
import Panel from './components/Panel'
import QueryInput from './components/QueryInput'

function App() {
  const [output, setOutput] = useState('')
  return (
    <div className="app" id="app">
      <Panel />
      <div className="query">
        <QueryInput />
        <div className="query__output"></div>
      </div>
    </div>
  )
}

export default App
