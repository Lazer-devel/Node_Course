import { useEffect, useState } from 'react'
import Filter from '../general/Filter'
import Layout from '../general/Layout/Layout'
import './search.scss'
import { fetchData } from '../mainPage/utils'
import LinkList, { createInitData } from '../general/LinkList'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import AdPreview from './AdPreview'

function Search() {
  const [adsByModel, setAdsByModel] = useState([])
  const [ads, setAds] = useState([])
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { mark, model } = useParams()

  useEffect(() => {
    const getModelAnnoument = async () => {
      const modelAnnouments = await fetchData(`/modelAnnouments?mark=${mark}`)
      setAdsByModel(modelAnnouments)
    }
    getModelAnnoument()
  }, [mark])

  useEffect(() => {
    const getAds = async () => {
      let url = ''
      // FIXME
      if (location.pathname === '/filter') {
        url = `/filter?${searchParams.toString()}`
      } else {
        url = '/catalog'

        url =
          mark && model
            ? url.concat(`/${mark}/${model}`)
            : (url = url.concat(`/${mark}`))
      }
      const response = await fetch(url, {
        cache: 'no-store',
      })
      const a = await response.json()
      console.log(a)
      setAds(a)
    }
    getAds()
  }, [location.pathname, mark, model, searchParams])

  return (
    <>
      <div className="general">
        <h1 className="general__header">
          Продажа автомобилей {mark} в&nbsp;Беларуси
        </h1>
      </div>
      {!model && (
        <LinkList
          commonUrl={`/catalog/${mark}/`}
          links={adsByModel.map(({ model, amount }) =>
            createInitData(model, amount, !amount)
          )}
        />
      )}
      <Filter />
      <h2 className="announment-list__header title">{`Найдено ${ads.length} объявления`}</h2>
      <div className="announment-list">
        <ul className="announment-list__content">
          {ads.map((ad) => (
            <AdPreview key={ad.id} ad={ad} />
          ))}
        </ul>
      </div>
    </>
  )
}

export default Search
