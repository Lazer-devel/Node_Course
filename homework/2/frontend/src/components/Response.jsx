function Response({ data }) {
  const { status, headers, body } = data
  return (
    status && (
      <div className="response">
        <h2 className="response__header">Ответ на запрос:</h2>
        <label className="response__status label">
          Статус ответа: {status}
        </label>
        <ul className="resonse__header-list">
          Заголовки ответа:
          {Object.keys(headers).map((key) => (
            <li className="response__header">{`${key}: ${headers[key]}`}</li>
          ))}
        </ul>
        <div className="response__body-wrapper">
          <h3 className="response__body-header">Тело ответа:</h3>
          <div className="resonse__body-content">{body}</div>
        </div>
      </div>
    )
  )
}

export default Response
