import { useEffect, useState } from 'react'

import Layout from '../general/Layout/Layout'
import Filter from '../general/Filter'
import LinkList, { createInitData } from '../general/LinkList'
import { fetchData } from './utils'

import './styles.scss'

function MainPage() {
  const [curAnnouments, setCurAnnouments] = useState([])
  const [annoumentCount, setAnnoumentCount] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    const getCurrentAnnouments = async () => {
      const annouments = await fetchData('/main', {
        cache: 'no-store',
        signal: controller.signal,
        credentials: 'include',
      })
      console.log(annouments)
      setCurAnnouments(annouments)
    }

    const getAnnoumentCount = async () => {
      const annoumentCount = await fetchData('/annoumentsCount', {
        cache: 'no-store',
        signal: controller.signal,
        credentials: 'include',
      })
      setAnnoumentCount(annoumentCount)
    }

    getCurrentAnnouments()
    getAnnoumentCount()

    return () => {
      //controller.abort()
    }
  }, [])

  return (
    <Layout>
      <div className="general">
        <h1 className="general__header">
          {annoumentCount} объявления о&nbsp;продаже авто в&nbsp;Беларуси
        </h1>
      </div>
      <LinkList
        commonUrl={'/catalog/'}
        links={curAnnouments.map(({ mark, amount }) =>
          createInitData(mark, amount, !amount)
        )}
        className="mainPage__link-list"
      />
      <Filter />
    </Layout>
  )
}

export default MainPage
