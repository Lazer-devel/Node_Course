import { nanoid } from 'nanoid'
import Dropdown from 'react-dropdown'

function KeyValueEditor({ title, initData, setInitData, nameList }) {
  const createNameField = (name) => {
    return nameList ? (
      <Dropdown
        className="kve__dropdown"
        controlClassName="kve__dropdown-control"
        arrowClassName="kve__dropdown-arrow"
        options={nameList}
      />
    ) : (
      <input className=" kve__input kve__input-input input" type="text" />
    )
  }
  return (
    <div className="kve">
      <label className="kve__label label">{title}</label>
      {initData.map(({ name, value, id }) => (
        <div className="kve__content" key={id}>
          {createNameField(name)}
          <input className="kve__input input" type="text" />
          <span
            className="kve__btn label-btn label-btn--red label-btn--small"
            onClick={() =>
              setInitData((prev) => prev.filter((header) => header.id !== id))
            }
          >
            Удалить
          </span>
        </div>
      ))}
      <span
        className="kve__btn label-btn label-btn--green label-btn--normal label-btn--bold"
        onClick={() =>
          setInitData((prev) => [
            ...prev,
            { name: '', value: '', id: nanoid() },
          ])
        }
      >
        Добавить
      </span>
    </div>
  )
}
export default KeyValueEditor
/*  className="request-constructor__method-dropdown"
            controlClassName="request-constructor__method-dropdown-control"
            menuClassName="request-constructor__method-dropdown-menu"
            arrowClassName="request-constructor__method-dropdown-arrow"
            options={methods}
            value={method}
            onChange={({ value }) => setMethod(value)} */
