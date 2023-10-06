//import logo from '../../../assets/av.svg'
//import { NavLink, useNavigate } from 'react-router-dom'
//import { useAuth } from '../../../hook/useAuth'

import Image from 'next/image'

import './styles/header.scss'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../../hook/useAuth'

function Header({ activeAuth }) {
  const { login } = useAuth()
  const router = useRouter()
  const createHeaders = () => {
    const createDropDownList = (children) => {
      return (
        <ul className="nav__dropdown-list">
          {children.map((child) => (
            <li key={child} className="nav__dropdown-item">
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
        <li
          key={h.name}
          className={`nav__item ${hasChildren ? 'nav__item-dropdown' : ''}`}
        >
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
          <Link href={'/'}>
            <Image width={82} height={50} src="/logo.svg" alt="logo" />
          </Link>
        </div>
        <div className="nav">
          <ul className="nav__main">
            {createHeaders()}
            <li className="nav__item nav__item--alt">
              <a className="nav__link" href="/">
                <span className="nav__link-text">Проверка VIN </span>
              </a>
            </li>
          </ul>
          <ul className="nav__personal">
            {login ? (
              <span className="nav__username">{`Вы вошли как: ${login}`}</span>
            ) : (
              <span href="/notFound" className="nav__link" onClick={activeAuth}>
                Войти
              </span>
            )}

            <button
              className="nav__btn"
              onClick={() => {
                if (login) {
                  return router.push('/new_ad')
                }
                activeAuth()
              }}
            >
              Подать объявление
            </button>
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
