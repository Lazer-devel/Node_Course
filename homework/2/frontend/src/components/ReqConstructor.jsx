import { useState } from 'react'
import { nanoid } from 'nanoid'
import Dropdown from 'react-dropdown'

function ReqConstructor({ setSavedReq }) {
  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState(methods[0])
  return (
    <div className="request-constructor">
      <div className="request-constructor__container">
        <div className="request-constructor__method-wrapper">
          <label className="request-constructor__method-label label">
            Метод
          </label>
          <Dropdown
            className="request-constructor__method-dropdown dropdown"
            controlClassName="request-constructor__method-dropdown-control"
            menuClassName="request-constructor__method-dropdown-menu"
            arrowClassName="request-constructor__method-dropdown-arrow"
            options={methods}
            value={method}
            onChange={({ value }) => setMethod(value)}
          />
        </div>
        <div className="request-constructor__url-wrapper">
          <label className="request-constructor__url-label label">URL</label>
          <input
            className="request-constructor__url-input input"
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          ></input>
        </div>
      </div>
      <div className="request-constructor__params"></div>
      <div className="request-constructor__headers"></div>
      <div className="request-constructor__control-btns">
        <input
          className="request-constructor__save-btn button"
          type="button"
          value="Сохранить запрос"
          disabled={!url}
          onClick={() => {
            setSavedReq((prev) => [...prev, { id: nanoid(), method, url }])
          }}
        />
        <input
          className="request-constructor__send-btn button"
          type="button"
          value="Отправить запрос"
          onClick={async () => {
            const response = await fetch('http://localhost:10000/fetch', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ url, method }),
            })
            console.log(response)
            console.log(await response.json())
          }}
        />
        <input
          className="request-constructor__clean-btn button"
          type="button"
          value="Очистить форму"
          onClick={() => {
            setUrl('')
            setMethod(methods[0])
          }}
        />
      </div>
    </div>
  )
}

export default ReqConstructor
