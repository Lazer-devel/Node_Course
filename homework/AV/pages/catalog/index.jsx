import Filter from '../../components/reusable/Filter'
import AdList from '../../components/search/AdList'
import Head from 'next/head'
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
      <Head>
        <title>
          Объявления о продаже автомобилей в Беларуси. Купить или продать
          автомобиль с пробегом, новый или б/у на Автомалиновке.
        </title>
        <meta
          content="av.by — продажа автомобилей в Беларуси. Купить или продать автомобиль с пробегом или новый на Автомалиновке. Частные объявления о продаже транспорта в Беларуси."
          property="og:description"
        />
        <meta
          content="av.by — продажа автомобилей в Беларуси. Купить или продать автомобиль с пробегом или новый на Автомалиновке. Частные объявления о продаже транспорта в Беларуси."
          name="description"
        />
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
