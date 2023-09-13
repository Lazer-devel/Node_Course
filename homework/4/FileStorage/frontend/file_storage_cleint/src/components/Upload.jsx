import { useState, useRef } from 'react'
import ProgressBar from '@ramonak/react-progress-bar'
import crssIcon from '../assets/cross.svg'

const WEBSOCKET_SERVER_PORT = 55555

function Upload({ exit, onLoadFailed, setFileList }) {
  const [isUploadDisabled, setUploadDisabled] = useState(true)
  const [abortController, _] = useState(new AbortController())
  const [uploadPercent, setUploadPercent] = useState(0)
  const [isLoadFailed, setLoadFailed] = useState(false)
  const formRef = useRef(null)

  const uploadFile = (event) => {
    event.preventDefault()
    setUploadDisabled(true)

    const ws = new WebSocket(
      `ws://${document.location.hostname}:${WEBSOCKET_SERVER_PORT}`
    )

    const errorHandler = () => {
      onLoadFailed()
      setUploadDisabled(false)
      setLoadFailed(true)
      ws.close()
    }

    const wsMessageHandler = async (event) => {
      const { action, data } = JSON.parse(event.data)
      switch (action) {
        case 'uploadId':
          const formData = new FormData()
          // порядок добавления важен!
          formData.append('uploadId', data)
          for (const pair of new FormData(formRef.current)) {
            formData.append(pair[0], pair[1])
          }
          try {
            const res = await fetch('/upload', {
              method: 'POST',
              body: formData,
              credentials: 'include',
              signal: abortController.signal,
            })
            const fileList = await res.json()
            setFileList(fileList)
            setTimeout(exit, 500)
          } catch (err) {
            errorHandler()
          }
          ws.close()
          break
        case 'uploadedPercent':
          setUploadPercent(data)
          break
        default:
          break
      }
    }

    const wsCloseHandle = () => {
      ws.removeEventListener('message', wsMessageHandler)
      ws.removeEventListener('error', errorHandler)
      ws.removeEventListener('close', wsCloseHandle)
    }

    ws.onmessage = wsMessageHandler
    ws.onerror = errorHandler
    ws.onclose = wsCloseHandle
  }

  return (
    <form className="upload__container" onSubmit={uploadFile} ref={formRef}>
      <img
        className="upload__cross"
        src={crssIcon}
        alt=""
        onClick={() => {
          abortController.abort()
          exit()
        }}
      />
      <div className="upload__file-wrapper">
        <input
          className="upload__file-content"
          type="file"
          name="file"
          onChange={() => {
            setUploadDisabled(false)
          }}
        />
      </div>
      <div className="upload__comment-wrapper">
        <label className="upload__comment-title" type="text">
          Комментарий
        </label>
        <input className="upload__comment-content" type="text" name="comment" />
      </div>

      <div className="upload__control-wrapper">
        <ProgressBar
          className="upload__control-progress-bar"
          completed={uploadPercent}
          transitionDuration="0.01s"
        />
        <input
          className="button"
          type="submit"
          value={isLoadFailed ? 'Повторить' : 'Загрузить'}
          disabled={isUploadDisabled}
        />
      </div>
    </form>
  )
}

export default Upload
