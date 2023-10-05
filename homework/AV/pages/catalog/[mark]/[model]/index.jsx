import Filter from '../../../../components/reusable/Filter'
import AdList from '../../../../components/search/AdList'
import '../../../../styles/search.scss'

export const getServerSideProps = async (context) => {
  const { mark, model } = context.params

  const ads = await fetch(
    `${process.env.HOST}/api/ads?mark=${mark}&model=${model}`
  )

  return {
    props: {
      mark,
      ads: await ads.json(),
    },
  }
}

const Component = ({ mark, ads }) => {
  return (
    <>
      <div className="general">
        <h1 className="general__header">
          Продажа автомобилей {mark} в&nbsp;Беларуси
        </h1>
      </div>
      <Filter />
      <AdList ads={ads} />
    </>
  )
}

export default Component
