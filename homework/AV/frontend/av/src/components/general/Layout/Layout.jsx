import { useRef, useState } from 'react'
import Header from './Header'

import './styles/layout.scss'
import Entry from './Entry/Entry'
import { Outlet } from 'react-router'

function Layout() {
  const [isModalActive, setModalActive] = useState(false)
  const modalRef = useRef(null)
  return (
    <>
      <Header activeAuth={() => setModalActive(true)} />
      <div className="content">
        <div className="content__layout">
          <Outlet />
        </div>
      </div>
      <div
        className={`modal ${
          isModalActive ? 'modal--visible' : 'modal--hidden'
        }`}
        ref={modalRef}
        onClick={(e) => {
          if (modalRef.current === e.target) {
            setModalActive(false)
          }
        }}
      >
        <Entry
          isVisible={isModalActive}
          setHidden={() => setModalActive(false)}
        />
      </div>
    </>
  )
}

export default Layout
