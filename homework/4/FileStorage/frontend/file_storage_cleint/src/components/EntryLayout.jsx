import { Outlet } from 'react-router-dom'

function EntryLayout() {
  return (
    <div className="entrance">
      <div className="entrance__content">
        <Outlet />
      </div>
    </div>
  )
}

export default EntryLayout
