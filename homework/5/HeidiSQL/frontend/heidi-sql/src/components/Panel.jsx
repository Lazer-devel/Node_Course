import { useState, useEffect } from 'react'
import Schema from './Schema'

import downloadIcon from '../assets/download.svg'

function Panel() {
  const [schemas, setSchemas] = useState([])

  const getSchemas = async () => {
    const response = await fetch('/schemas', {
      method: 'GET',
      cache: 'no-store',
    })
    const schemas = await response.json()
    setSchemas(schemas)
  }

  useEffect(() => {
    getSchemas()
  }, [])
  return (
    <div className="panel">
      <div className="panel__control">
        <img
          className="panel__update"
          src={downloadIcon}
          alt="reload"
          onClick={getSchemas}
        />
      </div>
      <div className="panel__content">
        {schemas.map(({ name, tables }) => (
          <Schema key={name} name={name} tables={tables} />
        ))}
      </div>
    </div>
  )
}

export default Panel
