import Search from './components/search/Search'
import LinkList from './components/general/LinkList'
import MainPage from './components/mainPage/MainPage'

import { Routes, Route } from 'react-router-dom'
import Ad from './components/ad/Ad'
//FIXME
function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<MainPage />} />

        <Route path="/catalog/">
          <Route index path=":mark" element={<Search />} />
          <Route path=":mark/:model" element={<Search />} />
          <Route path=":mark/:model/:id" element={<Ad />} />
        </Route>
        <Route path="/filter" element={<Search />}></Route>
      </Routes>
    </div>
  )
}

export default App
