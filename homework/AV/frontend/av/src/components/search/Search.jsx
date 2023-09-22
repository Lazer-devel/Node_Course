import { useEffect, useState } from 'react'
import Filter from '../general/Filter'
import Layout from '../general/Layout/Layout'
import './search.scss'
import { fetchData } from '../mainPage/utils'
import LinkList, { createInitData } from '../general/LinkList'
import Annoument from './Annoument'

function Search() {
  const [modelAnnouments, setModelAnnouments] = useState([])

  useEffect(() => {
    const getModelAnnoument = async () => {
      const modelAnnouments = await fetchData(`/modelAnnouments?mark=${'Audi'}`)
      setModelAnnouments(modelAnnouments)
    }
    getModelAnnoument()
  }, [])
  return (
    <Layout>
      <div className="general">
        <h1 className="general__header">
          Продажа автомобилей Audi в&nbsp;Беларуси
        </h1>
      </div>
      <LinkList
        links={modelAnnouments.map(({ model, amount }) =>
          createInitData(model, amount, !amount)
        )}
      />
      <Filter selectedMark={'Audi'} />
      <h2 className="announment-list__header title">Найдено 3 объявления</h2>
      <div className="announment-list">
        <ul className="announment-list__content">
          <Annoument />
          <Annoument />
          <Annoument />
          <Annoument />
          <Annoument />
          <Annoument />
          <Annoument />
        </ul>
      </div>
    </Layout>
  )
}

export default Search
