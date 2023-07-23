function SavedRequests({
  savedReq,
  setUrl,
  setMethod,
  setHeaders,
  setParams,
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
          }}
        >
          <label className="saved-requests__request-title label">
            Метод: {req.method}
          </label>
          <label className="saved-requests__request-url label">{req.url}</label>
        </li>
      ))}
    </ul>
  )
}

export default SavedRequests
