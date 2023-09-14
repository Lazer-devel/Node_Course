import './header.scss'
import logo from '../../assets/av.svg'

function Header() {
  const createHeaders = () => {
    const createDropDownList = (children) => {
      return (
        <ul className="nav__dropdown-list">
          {children.map((child) => (
            <li className="nav__dropdown-item">
              <a className="nav__dropdown-link" href="/">
                {child}
              </a>
            </li>
          ))}
        </ul>
      )
    }
    return headers.map((h) => {
      const hasChildren = !!h.children.length
      return (
        <li className={`nav__item ${hasChildren ? 'nav__item-dropdown' : ''}`}>
          <a className="nav__link" href="/notFound">
            <span className="nav__link-text">{h.name}</span>
          </a>
          {hasChildren && createDropDownList(h.children)}
        </li>
      )
    })
  }

  return (
    <div className="header">
      <div className="header__container">
        <div className="header__logo-wrap">
          <img
            style={{ width: '82px', height: '50px' }}
            src={logo}
            alt="logo"
          />
        </div>
        <div className="nav">
          <ul className="nav__main">
            {createHeaders()}
            <li className="nav__item nav__item--alt">
              <a className="nav__link" href="/notFound">
                <span className="nav__link-text">Проверка VIN </span>
              </a>
            </li>
          </ul>
          <ul className="nav__personal">
            <a href="/notFound" className="nav__link">
              Войти
            </a>
            <button className="nav__btn ">Подать объявление</button>
          </ul>
        </div>
      </div>
    </div>
  )
}

const headers = [
  {
    name: 'Транспорт',
    children: [
      'Автомобили с пробегом',
      'Новые автомобили',
      'Электромобили',
      'Грузовой транспорт',
      'Мототехника',
      'Сельхоз техника',
      'Спец техника',
      'Прицепы и полуприцепы',
      'Автобусы',
      'Водный транспорт',
    ],
  },
  {
    name: 'Запчасти и шины',
    children: [
      'Шины и диски',
      'Б/у запчасти для авто',
      'Весь авто на запчасти',
      'Автотовары и расходники',
    ],
  },
  {
    name: 'Журнал',
    children: [],
  },
  {
    name: 'Знания',
    children: [
      'Продажа автомобиля',
      'Покупка автомобиля',
      'Сделка купли-прожади',
      'Налоги и сборы',
      'Техосмотр',
    ],
  },
  {
    name: 'Финансы',
    children: [],
  },
]

export default Header
