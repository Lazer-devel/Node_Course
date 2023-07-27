import { nanoid } from 'nanoid'
import Dropdown from 'react-dropdown'

function KeyValueEditor({ title, initData, setInitData, nameList }) {
  const createNameField = (name, id) => {
    return nameList ? (
      <Dropdown
        className="kve__dropdown"
        controlClassName="kve__dropdown-control"
        arrowClassName="kve__dropdown-arrow"
        options={nameList}
        value={name}
        onChange={({ value }) => {
          setInitData((prev) =>
            new Map(prev).set(id, { name: value, value: prev.get(id).value })
          )
        }}
      />
    ) : (
      <input
        className=" kve__input input"
        type="text"
        value={name}
        onChange={(e) =>
          setInitData((prev) =>
            new Map(prev).set(id, {
              name: e.target.value,
              value: prev.get(id).value,
            })
          )
        }
      />
    )
  }
  return (
    <div className="kve">
      <label className="kve__label label">{title}</label>
      {[...initData.keys()].map((id) => (
        <div className="kve__content" key={id}>
          {createNameField(initData.get(id).name, id)}
          <input
            className="kve__input input"
            type="text"
            value={initData.get(id).value}
            onChange={(e) =>
              setInitData((prev) =>
                new Map(prev).set(id, {
                  name: prev.get(id).name,
                  value: e.target.value,
                })
              )
            }
          />
          <span
            className="kve__btn label-btn label-btn--red label-btn--small"
            onClick={() =>
              setInitData((prev) => {
                const newState = new Map(prev)
                newState.delete(id)
                return newState
              })
            }
          >
            Удалить
          </span>
        </div>
      ))}
      <span
        className="kve__btn label-btn label-btn--green label-btn--normal label-btn--bold"
        onClick={() =>
          setInitData((prev) =>
            new Map(prev).set(nanoid(), { name: '', value: '' })
          )
        }
      >
        Добавить
      </span>
    </div>
  )
}
export default KeyValueEditor
