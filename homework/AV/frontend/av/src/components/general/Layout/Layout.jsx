import { useRef, useState } from 'react'
import Content from './Content'
import Header from './Header'

import './styles/layout.scss'
import Entry from '../Entry/Entry'

function Layout({ children }) {
  const [isModalActive, setModalActive] = useState(false)
  const modalRef = useRef(null)
  return (
    <>
      <Header activeAuth={() => setModalActive(true)} />
      <Content>{children}</Content>
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
