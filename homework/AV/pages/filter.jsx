import Filter from '../components/reusable/Filter'
import AdList from '../components/search/AdList'
import '../styles/search.scss'

export const getServerSideProps = async (context) => {
  const searchParams = new URLSearchParams(context.query)
  const response = await fetch(
    `${process.env.HOST}/api/ads?${searchParams.toString()}`
  )

  return {
    props: {
      ads: await response.json(),
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
