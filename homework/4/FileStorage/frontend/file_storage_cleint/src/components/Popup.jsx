import React from 'react'
import { forwardRef } from 'react'

const PopUp = forwardRef(function (props, ref) {
  return (
    <div className="popup-container">
      <div className="popup-body" ref={ref}>
        <label>Ошибка загрузки файла!</label>
      </div>
    </div>
  )
})

export default PopUp
