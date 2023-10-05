import { useState } from 'react'

import './styles/dropdown.scss'

function DropDown({
  title,
  defaultTitle,
  children,
  onSelect,
  contentFormat = 'list',
}) {
  const [isDropDownActive, setIsDropDownActive] = useState(false)
  const contentWrapperClasses = `dropdown__content dropdown__content--${
    contentFormat === 'list' ? contentFormat : 'table'
  } ${
    isDropDownActive
      ? 'dropdown__content--visible'
      : 'dropdown__content--hidden'
  }`
  return (
    <button
      className={`dropdown ${
        children.length ? 'dropdown--active' : 'dropdown--disabled'
      }`}
      onClick={() => {
        setIsDropDownActive((prev) => !prev)
      }}
      disabled={!children.length}
      onBlur={() => setIsDropDownActive(false)}
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

      <ul className={contentWrapperClasses}>
        {children.map((child, i) => (
          <li
            key={i}
            className={`dropdown__item ${
              title === child ? 'dropdown__item--selected' : ''
            }`}
            onClick={(e) => {
              onSelect(e.currentTarget.innerText)
            }}
          >
            {child}
          </li>
        ))}
      </ul>
    </button>
  )
}

export default DropDown
