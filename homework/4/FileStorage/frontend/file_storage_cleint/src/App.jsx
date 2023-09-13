import './App.scss'
import { useEffect } from 'react'
import Modal from 'react-modal'

import { Route, Routes } from 'react-router-dom'
import Mainpage from './components/MainPage'
import Authentification from './components/Authentification'
import Registration from './components/Registration'
import EntryLayout from './components/EntryLayout'
import AuthProvider from './hoc/AuthProvider'
import RequireAuth from './hoc/RequireAuth'

function App() {
  useEffect(() => {
    Modal.setAppElement('#app')
  }, [])

  return (
    <div className="app" id="app">
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Mainpage />
              </RequireAuth>
            }
          />
          <Route path="/entry" element={<EntryLayout />}>
            <Route path="/entry/auth" element={<Authentification />} />
            <Route path="/entry/reg" element={<Registration />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App
