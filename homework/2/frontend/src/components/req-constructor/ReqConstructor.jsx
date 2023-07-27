import { useRef, useState } from 'react'
import { nanoid } from 'nanoid'

import Dropdown from 'react-dropdown'
import Response from '../Response'
import KeyValueEditor from './KeyValueEditor'
import SavedRequests from './SavedRequests'
import { methods, reqHeaders, preSavedReq } from '../../constants'

function ReqConstructor() {
  const [savedReq, setSavedReq] = useState(preSavedReq)
  const [url, setUrl] = useState('')
  const [method, setMethod] = useState(methods[0])
  const [headers, setHeaders] = useState(new Map())
  const [params, setParams] = useState(new Map())
  const [response, setResponse] = useState({})
  const [name, setName] = useState('')
  const bodyRef = useRef(null)

  const createProxyGetReq = (headers) => {
    const urlWithParams = `${url}?${Array.from(params.values())
      .filter((par) => par.name && par.value)
      .map((par) => `${par.name}={${par.value}}`)
      .join('&')}`

    return {
      url: params.size ? urlWithParams : url,
      method,
      headers,
    }
  }

  const createProxyNonGetReq = (headers) => {
    return bodyRef.current.value
      ? { url, method, headers, body: bodyRef.current.value }
      : { url, method, headers }
  }

  const sendProxyReq = async () => {
    const hdrs = [...headers.values()]
      .filter((hdr) => hdr.name && hdr.value)
      .reduce((acc, cur) => Object.assign(acc, { [cur.name]: cur.value }), {})
    const proxyReq =
      method === 'GET' ? createProxyGetReq(hdrs) : createProxyNonGetReq(hdrs)

    const res = await fetch('/fetch', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(proxyReq),
    })
    setResponse(await res.json())
  }
  return (
    <div className="container">
      <SavedRequests
        savedReq={savedReq}
        setUrl={setUrl}
        setMethod={setMethod}
        setHeaders={setHeaders}
        setParams={setParams}
        setResponse={setResponse}
        bodyRef={bodyRef}
      />
      <div className="request-constructor">
        <div className="request-constructor__container">
          <div className="request-constructor__name-wrapper">
            <label className="request-constructor__name-label label">Имя</label>
            <input
              className="request-constructor__name-input input"
              type="text"
              placeholder="Имя запроса"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
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
        <div
          className="request-constructor__body-wrapper"
          style={{ display: method === 'GET' ? 'none' : 'flex' }}
        >
          <label className="request-constructor__body-label label">
            Тело запроса
          </label>
          <textarea
            className="request-constructor__body-content input"
            ref={bodyRef}
          ></textarea>
        </div>

        {method === 'GET' && (
          <KeyValueEditor
            title={'Параметры'}
            initData={params}
            setInitData={setParams}
          />
        )}
        <KeyValueEditor
          title={'Заголовоки'}
          initData={headers}
          setInitData={setHeaders}
          nameList={reqHeaders}
        />
        <div className="request-constructor__control-btns">
          <input
            className="request-constructor__save-btn button"
            type="button"
            value="Сохранить запрос"
            disabled={!(url && name)}
            onClick={() => {
              setSavedReq((prev) => [
                ...prev,
                {
                  id: nanoid(),
                  name,
                  method,
                  url,
                  headers,
                  params,
                  body: bodyRef.current ? bodyRef.current.value : '',
                },
              ])
            }}
          />
          <input
            className="request-constructor__send-btn button"
            type="button"
            value="Отправить запрос"
            disabled={!(method && url)}
            onClick={sendProxyReq}
          />
          <input
            className="request-constructor__clean-btn button"
            type="button"
            value="Очистить форму"
            onClick={() => {
              if (bodyRef.current) {
                bodyRef.current.value = ''
              }
              setUrl('')
              setMethod(methods[0])
              setHeaders(new Map())
              setParams(new Map())
              setResponse({})
            }}
          />
        </div>
        <Response data={response} />
      </div>
    </div>
  )
}

export default ReqConstructor
