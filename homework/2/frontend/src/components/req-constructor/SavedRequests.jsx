function SavedRequests({
  savedReq,
  setUrl,
  setMethod,
  setHeaders,
  setParams,
  setResponse,
  bodyRef,
}) {
  return (
    <ul className="saved-requests">
      {savedReq.map((req) => (
        <li
          className="saved-requests__request"
          key={req.id}
          onClick={() => {
            setUrl(req.url)
            setMethod(req.method)
            setHeaders(req.headers)
            setParams(req.params)
            setResponse({})
            if (bodyRef.current) {
              bodyRef.current.value = `${req.body}`
            }
          }}
        >
          <label className="saved-requests__request-name label">
            {req.name}
          </label>
          <label className="saved-requests__request-method label">
            Метод: {req.method}
          </label>
          <label className="saved-requests__request-url label">{req.url}</label>
        </li>
      ))}
    </ul>
  )
}

export default SavedRequests
