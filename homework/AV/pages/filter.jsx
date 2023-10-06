import Filter from '../components/reusable/Filter'
import AdList from '../components/search/AdList'
import Head from 'next/head'
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
      <Head>
        <title>
          av.by — купить, продать авто в Беларуси. Автомобили новые и с пробегом
          на Автомалиновке.
        </title>
      </Head>
      <div className="general">
        <h1 className="general__header">Автомобили</h1>
      </div>
      <Filter />
      <AdList ads={ads} />
    </>
  )
}

export default Component
