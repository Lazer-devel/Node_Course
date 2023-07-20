function SavedRequests({ savedReq }) {
  return (
    <ul className="saved-requests">
      {savedReq.map((req) => (
        <li className="saved-requests__request" key={req.id}>
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
