import { Link } from 'react-router-dom'

function LinkButton({ to, className, text }) {
  return (
    <Link to={to} className={`${className} button`}>
      {text}
    </Link>
  )
}

export default LinkButton
