import Filter from '../../../components/reusable/Filter'
import LinkList from '../../../components/reusable/LinkList'
import AdList from '../../../components/search/AdList'

import '../../../styles/search.scss'

export const getServerSideProps = async (context) => {
  const { mark } = context.params

  const req1 = fetch(`${process.env.HOST}/api/modelAdByMark?mark=${mark}`)

  const req2 = fetch(`${process.env.HOST}/api/ads?mark=${mark}`)

  const [response1, response2] = await Promise.all([req1, req2])

  return {
    props: {
      mark,
      adsByModel: await response1.json(),
      ads: await response2.json(),
    },
  }
}

const Component = ({ mark, adsByModel, ads }) => {
  return (
    <>
      <div className="general">
        <h1 className="general__header">
          Продажа автомобилей {mark} в&nbsp;Беларуси
        </h1>
      </div>
      <LinkList
        commonUrl={`/catalog/${mark}/`}
        links={adsByModel.map(({ model, amount }) => {
          return {
            title: model,
            subtitle: amount,
            isInActive: !amount,
          }
        })}
      />
      <Filter />
      <AdList ads={ads} />
    </>
  )
}

export default Component
