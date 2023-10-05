import Filter from '../../components/reusable/Filter'
import AdList from '../../components/search/AdList'

import '../../styles/search.scss'

export const getServerSideProps = async (context) => {
  const ads = await fetch(`${process.env.HOST}/api/ads`)

  return {
    props: {
      ads: await ads.json(),
    },
  }
}

const Component = ({ ads }) => {
  return (
    <>
      <div className="general">
        <h1 className="general__header">Автомобили</h1>
      </div>
      <Filter />
      <AdList ads={ads} />
    </>
  )
}

export default Component
