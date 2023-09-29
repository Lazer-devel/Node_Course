import Search from './components/search/Search'
import LinkList from './components/general/LinkList'
import MainPage from './components/mainPage/MainPage'

import { Routes, Route } from 'react-router-dom'
import Ad from './components/ad/Ad'
import RequireAuth from './hoc/RequireAuth'
import Layout from './components/general/Layout/Layout'
import { useState } from 'react'
import AdEditor from './components/adEditor/AdEditor'

//FIXME
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="catalog/">
            <Route index path=":mark" element={<Search />} />
            <Route path=":mark/:model" element={<Search />} />
            <Route path=":mark/:model/:id" element={<Ad />} />
          </Route>
          <Route path="filter" element={<Search />} />
          <Route
            path="new_ad"
            element={
              <RequireAuth cb={() => {}}>
                <AdEditor />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
