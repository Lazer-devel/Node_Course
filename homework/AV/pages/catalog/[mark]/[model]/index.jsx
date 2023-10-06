import Filter from '../../../../components/reusable/Filter'
import AdList from '../../../../components/search/AdList'
import Head from 'next/head'
import '../../../../styles/search.scss'

export const getServerSideProps = async (context) => {
  const { mark, model } = context.params

  const ads = await fetch(
    `${process.env.HOST}/api/ads?mark=${mark}&model=${model}`
  )

  return {
    props: {
      mark,
      model,
      ads: await ads.json(),
    },
  }
}

const Component = ({ mark, model, ads }) => {
  return (
    <>
      <Head>
        <title>
          Купить {mark} {model}| {ads.length} объявлений о продаже на av.by |
          Цены, характеристики, фото.
        </title>
        <meta
          content={`${ads.length} объявлений о продаже ${mark} ${model} с пробегом на Автомалиновке. ✔ актуальные цены ✔ описание и фотографии ✔ подписка на новые объявления ✔ подбор кредита и лизинга. Купить или продать автомобиль Audi A8 в любом городе Беларуси. Частные объявления о продаже б/у ${mark} ${model}`}
          name="description"
        />
        <meta
          content={`${mark} ${model}, цена, продать, объявления, с пробегом, новая, бу`}
          name="keywords"
        />
        <meta
          content={`${ads.length} объявлений о продаже Audi A8 с пробегом. Цены, фотографии и характеристики автомобилей ${mark} ${model}`}
          property="og:description"
        />
      </Head>
      <div className="general">
        <h1 className="general__header">
          Продажа автомобилей {mark} {model} в&nbsp;Беларуси
        </h1>
      </div>
      <Filter />
      <AdList ads={ads} />
    </>
  )
}

export default Component
