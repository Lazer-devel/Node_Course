import './App.scss'
import { useState, useEffect, useRef } from 'react'
import Modal from 'react-modal'
import FileTable from './components/FileTable'
import Popup from './components/Popup'
import Upload from './components/Upload'
import Entrance from './components/Entrance'

function App() {
  const [isUpload, setUpload] = useState(false)
  const [isAuthorized, setAuthorized] = useState(false)

  const [fileList, setFileList] = useState([])
  const popUpRef = useRef(null)

  useEffect(() => {
    const getFileList = async () => {
      const response = await fetch('http://localhost:10004/getFileList', {
        method: 'GET',
        cache: 'no-store',
      })
      const fileList = await response.json()
      setFileList(fileList)
    }
    getFileList()
  }, [])

  useEffect(() => {
    Modal.setAppElement('#app')
  }, [])

  const onLoadFailed = () => {
    popUpRef.current.className = 'popup-body popup-body--animate'
    setTimeout(() => {
      popUpRef.current.className = 'popup-body'
    }, 3000)
  }

  return (
    <div className="app" id="app">
      <Entrance />
    </div>
  )
  return (
    <div className="app" id="app">
      {isAuthorized ? (
        <>
          <FileTable fileList={fileList} onLoadFailed={onLoadFailed} />
          <div className="control">
            <button className="button" onClick={() => setUpload(true)}>
              Добавить
            </button>
          </div>
          <Modal className="upload" isOpen={isUpload}>
            <Upload
              exit={() => setUpload(false)}
              onLoadFailed={onLoadFailed}
              setFileList={setFileList}
            />
          </Modal>
          <Popup ref={popUpRef} />{' '}
        </>
      ) : (
        <Entrance />
      )}
    </div>
  )
}

export default App
