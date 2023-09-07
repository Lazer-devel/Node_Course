import { useState } from 'react'
import './App.scss'
import 'animate.css'
import Panel from './components/Panel'
import QueryInput from './components/QueryInput'
import QueryOutput from './components/QueryOutput'

function App() {
  const [output, setOutput] = useState('')
  return (
    <div className="app" id="app">
      <Panel />
      <div className="query">
        <QueryInput setOutput={setOutput} />
        <QueryOutput output={output} />
      </div>
    </div>
  )
}

export default App
