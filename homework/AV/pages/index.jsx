import Filter from '../components/reusable/Filter'
import LinkList, { createInitData } from '../components/reusable/LinkList'

import '../styles/index.scss'

export const getServerSideProps = async (context) => {
  let response = await fetch(`${process.env.HOST}/api/adCountByMark`, {
    cache: 'no-store',
    credentials: 'include',
  })

  const adByMark = await response.json()

  response = await fetch(`${process.env.HOST}/api/totalAdCount`, {
    cache: 'no-store',
    credentials: 'include',
  })

  const adCount = await response.json()
  return {
    props: { adByMark, adCount },
  }
}

function MainPage({ adByMark, adCount }) {
  return (
    <>
      <div className="general">
        <h1 className="general__header">
          {adCount} объявления о&nbsp;продаже авто в&nbsp;Беларуси
        </h1>
      </div>
      <LinkList
        commonUrl={'/catalog/'}
        links={adByMark.map(({ mark, amount }) =>
          createInitData(mark, amount, !amount)
        )}
        className="mainPage__link-list"
      />
      <Filter />
    </>
  )
}

export default MainPage
