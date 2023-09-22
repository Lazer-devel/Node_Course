import './styles/link-list.scss'

export function createInitData(title, subtitle, isInActive) {
  return { title, subtitle, isInActive }
}

function LinkList({ links, className = '' }) {
  return (
    <ul className={`link-list ${className}`}>
      {links.map(({ title, subtitle, isInActive }) => (
        <li key={title} className="link-list__item">
          <a
            className={`link-list__link ${
              isInActive && 'link-list__link--disabled'
            }`}
            href="/"
            title={title}
            onClick={(e) => {
              if (isInActive) {
                e.preventDefault()
              }
            }}
          >
            <span className="link-list__title">{title}</span>
            <span className="link-list__subtitle">{subtitle}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
export default LinkList
