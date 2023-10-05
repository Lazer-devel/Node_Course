import { useState } from 'react'
import Image from 'next/image'

import '../../../../styles/ad.scss'

//610x440
export const getServerSideProps = async (context) => {
  const { mark, model, id } = context.params
  const ads = await fetch(
    `${process.env.HOST}/api/ads?mark=${mark}&model=${model}&id=${id}`
  )

  return {
    props: {
      initData: (await ads.json()).pop(),
    },
  }
}

const Component = ({ initData }) => {
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

  const nextClick = () => {
    if (curImageId === photo_amount) {
      return setCurImageId(1)
    }
    setCurImageId((prev) => ++prev)
  }

  const prevClick = () => {
    if (curImageId === 1) {
      return setCurImageId(photo_amount)
    }
    setCurImageId((prev) => --prev)
  }

  return (
    <div className="ad">
      <div className="general">
        <h1 className="general__header">
          Продажа {mark} {model} {generation}, {year}&nbsp;г. {city}
        </h1>
      </div>
      <div className="card">
        <div className="gallery">
          <div className="gallery__previous" onClick={prevClick}>
            <Image
              className="gallery__icon"
              width={25}
              height={27}
              src="/leftArrow.png"
              alt=""
            />
          </div>
          <div className="gallery__next" onClick={nextClick}>
            <Image
              className="gallery__icon"
              width={25}
              height={27}
              src="/rigthArrow.png"
              alt=""
            />
          </div>
          <img
            className="gallery__img"
            src={`/ad/${markId}/${modelId}/${generationId}/${id}/610x440/${curImageId}.jpeg`}
            width="612px"
            height="439px"
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
  )
}

export default Component
