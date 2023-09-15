import { useState } from 'react'

import './dropdown.scss'

function DropDown({ initData }) {
  const { defaultTitle, children, isSelected } = initData

  const [title, setTitle] = useState(isSelected ? children[0] : null)
  const [isDropDownActive, setIsDropDownActive] = useState(false)

  return (
    <button
      className="dropdown"
      onClick={() => {
        setIsDropDownActive((prev) => !prev)
      }}
    >
      <span
        className={`dropdown__title ${title ? 'dropdown__title--offset' : ''}`}
      >
        {title || defaultTitle}
        <span
          className={`dropdown__subtitle ${
            title ? 'dropdown__subtitle--visible' : ''
          }`}
        >
          {defaultTitle}
        </span>
      </span>

      <ul
        className={`dropdown__list ${
          isDropDownActive
            ? 'dropdown__list--visilbe'
            : 'dropdown__list--hidden'
        }`}
      >
        {children.map((child) => (
          <li
            key={child}
            className={`dropdown__item ${
              title === child ? 'dropdown__item--selected' : ''
            }`}
            onClick={() => setTitle(child)}
          >
            {child}
          </li>
        ))}
      </ul>
    </button>
  )
}

export default DropDown
