import Head from 'next/head'
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
      <Head>
        <title>
          av.by — купить, продать авто в Беларуси. Автомобили новые и с пробегом
          на Автомалиновке.
        </title>
        <meta
          content="Автомобильный сайт Беларуси Av.by - объявления о продаже, покупке, обмене авто новых и б/у, запчастей на авторынке Беларуси. Фото, отзывы, авто-новости | Автомалиновка"
          property="og:description"
        />
        <meta
          content="Автомобильный сайт Беларуси Av.by - объявления о продаже, покупке, обмене авто новых и б/у, запчастей на авторынке Беларуси. Фото, отзывы, авто-новости | Автомалиновка"
          name="description"
        ></meta>
        <meta
          content="автомалиновка, авто, автомобили, новости, статьи, отзывы, объявления, фото, фотографии, покупка, продажа, обмен, услуги, запчасти, грузоперевозки, форум, обсуждения, поиск, выбор авто, таможенный калькулятор, оценка, стоимость авто, автосалон, автохаус, автофирма, беларусь, минск"
          name="keywords"
        />
      </Head>
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
