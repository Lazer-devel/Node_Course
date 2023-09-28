import './styles/link-list.scss'
import { NavLink } from 'react-router-dom'

export function createInitData(title, subtitle, isInActive) {
  return { title, subtitle, isInActive }
}

function LinkList({ commonUrl, links, className = '' }) {
  return (
    <ul className={`link-list ${className}`}>
      {links.map(({ title, subtitle, isInActive }) => (
        <li key={title} className="link-list__item">
          <NavLink
            className={`link-list__link ${
              isInActive && 'link-list__link--disabled'
            }`}
            to={`${commonUrl}${title}`}
            title={title}
            onClick={(e) => {
              if (isInActive) {
                e.preventDefault()
              }
            }}
          >
            <span className="link-list__title">{title}</span>
            <span className="link-list__subtitle">{subtitle}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
export default LinkList
