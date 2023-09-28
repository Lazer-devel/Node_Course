import { useLocation } from 'react-router'
import './style.scss'
import { useEffect, useState } from 'react'
import Layout from '../general/Layout/Layout'
import rightArrow from '../../assets/gallery-arrow-right.png'
import leftArrow from '../../assets/gallery-arrow-left.png'

function Ad() {
  const location = useLocation()
  const [initData, setInitData] = useState({})
  const [curImageId, setCurImageId] = useState(1)
  const {
    id,
    cost,
    year,
    comment,
    volume,
    city,
    mileage,
    fuel,
    transmission,
    body,
    date,
    photo_amount,
    markId,
    modelId,
    generationId,
    mark,
    model,
    generation,
  } = initData
  useEffect(() => {
    const init = async () => {
      const response = await fetch(
        `http://localhost:55555${location.pathname}`,
        {
          cache: 'no-store',
        }
      )
      const data = await response.json()
      setInitData(data)
      console.log(data)
    }
    init()
  }, [location.pathname])

  const nextClick = () => {
    if (curImageId === photo_amount) {
      return setCurImageId(1)
    }
    setCurImageId((prev) => ++prev)
  }

  const prevClick = () => {
    console.log(photo_amount)
    if (curImageId === 1) {
      return setCurImageId(photo_amount)
    }
    setCurImageId((prev) => --prev)
  }

  return (
    <Layout>
      <div className="ad">
        <div className="general">
          <h1 className="general__header">
            Продажа {mark} {model} {generation}, {year}&nbsp;г. {city}
          </h1>
        </div>
        <div className="card">
          <div className="gallery">
            <div className="gallery__previous" onClick={prevClick}>
              <img className="gallery__icon" src={leftArrow} alt="" />
            </div>
            <div className="gallery__next" onClick={nextClick}>
              <img className="gallery__icon" src={rightArrow} alt="" />
            </div>
            <img
              className="gallery__img"
              src={`http://localhost:55555/ad/${markId}/${modelId}/${generationId}/${id}/${curImageId}.jpg`}
              width={612}
              height={439}
              alt=""
            />
          </div>
          <div className="description">
            <span className="description__cost">{cost}&nbsp;y.e.</span>
            <span className="description__info">
              {year}&nbsp;г., {transmission}, {body}, {volume}&nbsp;л, {fuel},{' '}
              {mileage}
              &nbsp;км.
            </span>
            <span className="description__location">
              {city} {date}
            </span>
          </div>
        </div>
        <div className="comment">
          <h2 className="comment__header">Описание</h2>
          <div className="comment__content">{comment}</div>
        </div>
      </div>
    </Layout>
  )
}

export default Ad