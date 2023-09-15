import { useState } from 'react'
import crossIcon from '../../assets/cross.svg'

import './input.scss'
function Input({ title }) {
  const [value, setValue] = useState('')
  return (
    <div className="input">
      <input
        className={`input__content ${value ? 'input__content--offset' : ''}`}
        type="text"
        placeholder={title}
        value={value}
        onChange={(e) => {
          const str = e.target.value
          console.log(str)
          if (/^\d{0,6}$/.test(str)) {
            setValue(str)
          }
        }}
      />
      <span
        className={`input__subtitle ${value ? 'input__subtitle--visible' : ''}`}
      >
        {title}
      </span>
      {value && (
        <img
          className="input__cross"
          src={crossIcon}
          alt="clear"
          onClick={() => setValue('')}
        />
      )}
    </div>
  )
}

export default Input
