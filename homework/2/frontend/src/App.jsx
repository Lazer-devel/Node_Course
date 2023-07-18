import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

import './App.scss'

function App() {
  const methods = ['GET', 'POST', 'PUT', 'DELETE']
  return (
    <div className="container">
      <ul className="saved-requests">
        <li className="saved-requests__request-wrapper">
          <label className="saved-requests__request-title label">
            Метод: GET
          </label>
          <label className="saved-requests__request-url label">
            http://intagram.com/fafsa/fasfasfa/sfas
          </label>
        </li>
      </ul>
      <form className="request-constructor">
        <div className="request-constructor__container">
          <div className="request-constructor__method-wrapper">
            <label className="request-constructor__method-label label">
              Метод
            </label>
            <Dropdown
              className="request-constructor__method-dropdown dropdown"
              controlClassName="request-constructor__method-dropdown-control"
              menuClassName="request-constructor__method-dropdown-menu"
              arrowClassName="request-constructor__method-dropdown-arrow"
              options={methods}
              value={methods[0]}
            />
          </div>
          <div className="request-constructor__url-wrapper">
            <label className="request-constructor__url-label label">URL</label>
            <input
              className="request-constructor__url-input input"
              type="text"
              placeholder="URL"
            ></input>
          </div>
        </div>
        <div className="request-constructor__params"></div>
        <div className="request-constructor__headers"></div>
        <div className="request-constructor__control-btns">
          <input
            className="request-constructor__save-btn button"
            type="button"
            value="Сохранить запрос"
          />
          <input
            className="request-constructor__send-btn button"
            type="submit"
            value="Отправить запрос"
          />
          <input
            className="request-constructor__clean-btn button"
            type="button"
            value="Очистить форму"
          />
        </div>
      </form>
      <div className="request-response"></div>
    </div>
  )
}

export default App
