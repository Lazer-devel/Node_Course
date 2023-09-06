import { CSSTransition } from 'react-transition-group'
import tableIcon from '../assets/table.svg'
import schemaIcon from '../assets/schema.svg'
import arowIcon from '../assets/arrow.svg'
import viewIcon from '../assets/view.svg'
import { useState } from 'react'

function Schema({ name, tables }) {
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="panel__schema-wrapper">
      <div className="panel__schema-header">
        <img
          className={`panel__schema-open-icon ${
            isOpen ? 'panel__schema-open-icon--opened' : ''
          } icon`}
          src={arowIcon}
          alt="open"
          onClick={() => setOpen((prev) => !prev)}
        />
        <img
          className="panel__schema-icon icon"
          src={schemaIcon}
          alt="schema"
        />
        <span className="panel__schema-title"> {name}</span>
      </div>

      <div className="panel__schema-table-list">
        {tables.map((table) => {
          return (
            <CSSTransition
              key={table}
              in={isOpen}
              classNames={{
                enterActive: 'animate__animated animate__lightSpeedInLeft',
                exitActive: 'animate__animated animate__lightSpeedOutLeft',
              }}
              timeout={500}
              unmountOnExit
            >
              <div key={table} className="panel__schema-table-wrapper">
                <img
                  className="panel__schema-table-icon icon"
                  src={schemaIcon}
                  alt="table type"
                />
                <span className="panel__schema-table-title">{table}</span>
              </div>
            </CSSTransition>
          )
        })}
      </div>
    </div>
  )
}
export default Schema
