import './styles/content.scss'

function Content({ children }) {
  return (
    <div className="content">
      <div className="content__layout">{children}</div>
    </div>
  )
}
export default Content
