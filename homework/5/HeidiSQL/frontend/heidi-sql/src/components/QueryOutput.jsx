// КАК динамически передать значение в css при первом рендере кроме inline

function QueryOutput({ output }) {
  const { status, data } = output

  const createTable = () => {
    const columnCount = Object.keys(data[0]).length
    return (
      <table
        className="query__output-content"
        style={{
          gridTemplateColumns: `repeat(${columnCount}, minmax(150px, 1fr))`,
        }}
      >
        <thead>
          <tr>
            {Object.keys(data[0]).map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            return (
              <tr>
                {Object.values(row).map((val) => (
                  <td key={val}>{val}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }

  return (
    <div className="query__output">
      {status === 'ok' ? createTable() : data}
    </div>
  )
}

export default QueryOutput
