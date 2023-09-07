import { CSSTransition } from 'react-transition-group'
import tableIcon from '../assets/table.svg'
import schemaIcon from '../assets/schema.svg'
import arowIcon from '../assets/arrow.svg'
import viewIcon from '../assets/view.svg'
import { useState } from 'react'

function Schema({ name, tables }) {
  const [isOpen, setOpen] = useState(false)

  const getIconByType = (type) => {
    switch (type) {
      case 'VIEW':
        return viewIcon
      case 'TABLE':
        return tableIcon
      default:
        throw new Error('Invalid table type')
    }
  }
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
        {tables.map(({ name, type }) => {
          return (
            <CSSTransition
              key={name}
              in={isOpen}
              classNames={{
                enterActive: 'animate__animated animate__lightSpeedInLeft',
                exitActive: 'animate__animated animate__lightSpeedOutLeft',
              }}
              timeout={500}
              unmountOnExit
            >
              <div className="panel__schema-table-wrapper">
                <img
                  className="panel__schema-table-icon icon"
                  src={getIconByType(type)}
                  alt="table type"
                />
                <span className="panel__schema-table-title">{name}</span>
              </div>
            </CSSTransition>
          )
        })}
      </div>
    </div>
  )
}
export default Schema
