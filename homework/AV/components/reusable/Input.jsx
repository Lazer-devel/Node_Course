import Image from 'next/image'

import './styles/input.scss'

function Input({ title, value, setValue }) {
  return (
    <div className="input">
      <input
        className={`input__content ${value ? 'input__content--offset' : ''}`}
        type="text"
        placeholder={title}
        value={value}
        onChange={(e) => {
          const str = e.target.value
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
        <Image
          className="input__cross"
          src="/cross.svg"
          width={12}
          height={12}
          alt="clear"
          onClick={() => setValue('')}
        />
      )}
    </div>
  )
}

export default Input
