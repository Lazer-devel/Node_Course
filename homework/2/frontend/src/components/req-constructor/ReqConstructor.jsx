import { useRef, useState } from 'react'
import { nanoid } from 'nanoid'
import Dropdown from 'react-dropdown'
import Response from '../Response'
import KeyValueEditor from './KeyValueEditor'

function ReqConstructor({ setSavedReq }) {
  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  const [url, setUrl] = useState('https://petstore.swagger.io/v2/pet/0')
  const [method, setMethod] = useState(methods[0])
  const [headers, setHeaders] = useState([])
  const [params, setParams] = useState([])
  const [response, setResponse] = useState({})
  const bodyRef = useRef(null)

  const sendReq = async () => {
    const reqBody =
      method === 'GET'
        ? { url, method }
        : {
            url,
            method,
            body: bodyRef.current.value,
          }
    const res = await fetch('http://localhost:10000/fetch', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
    setResponse(await res.json())
  }
  return (
    <div className="request-constructor">
      <div className="request-constructor__container">
        <div className="request-constructor__method-wrapper">
          <label className="request-constructor__method-label label">
            Метод
          </label>
          <Dropdown
            className="request-constructor__method-dropdown"
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
      {method !== 'GET' && (
        <div className="request-constructor__body-wrapper">
          <label className="request-constructor__body-label label">
            Тело запроса
          </label>
          <textarea
            className="request-constructor__body-content input"
            value={`{
              "id": 0,
              "category": {
                "id": 0,
                "name": "string"
              },
              "name": "doggie",
              "photoUrls": [
                "string"
              ],
              "tags": [
                {
                  "id": 0,
                  "name": "string"
                }
              ],
              "status": "available"
            }`}
            ref={bodyRef}
          ></textarea>
        </div>
      )}
      {method === 'GET' && (
        <KeyValueEditor
          title={'Параметры'}
          initData={params}
          setInitData={setParams}
        />
      )}
      <KeyValueEditor
        title={'Заголовок'}
        initData={headers}
        setInitData={setHeaders}
        nameList={['fsfdaf', 'fasfasfas', 'fasfsa']}
      />
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
          onClick={sendReq}
        />
        <input
          className="request-constructor__clean-btn button"
          type="button"
          value="Очистить форму"
          onClick={() => {
            setUrl('')
            setMethod(methods[0])
            setHeaders([])
            setParams([])
          }}
        />
      </div>
      <Response data={response} />
    </div>
  )
}

export default ReqConstructor
