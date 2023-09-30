import { NavLink } from 'react-router-dom'
import './ad-preview.scss'

// FIXME 1 NAVLINK with ::before
function AdPreview({ ad }) {
  const {
    id,
    mark,
    model,
    generation,
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
    markId,
    modelId,
    generationId,
  } = ad
  return (
    <li className="ad-preview">
      <NavLink
        to={`/catalog/${mark}/${model}/${id}`}
        className="ad-preview__img"
      >
        <img
          src={`http://localhost:55555/ad/${markId}/${modelId}/${generationId}/${id}/1.jpeg`}
          alt=""
          width="200px"
          height="200px"
          style={{ objectFit: 'cover' }}
        />
      </NavLink>
      <NavLink
        to={`/catalog/${mark}/${model}/${id}`}
        className="ad-preview__title"
      >
        {`${mark} ${model} ${generation}`}
      </NavLink>
      <div className="ad-preview__about">
        <span className="ad-previewt__year">{year} г.</span>
        <span className="ad-preview__description">
          {transmission}, {volume} л, {fuel}, {body}.
        </span>
        <span className="ad-previewt__mileage">{mileage} км</span>
      </div>
      <div className="ad-preview__price-wrapper">
        <span className="ad-preview__price">{cost}&nbsp;y.e.</span>
      </div>
      <span className="ad-preview__comment">{comment}</span>
      <div className="ad-preview__info">
        <span className="ad-preview__location">{city}</span>
        <span className="ad-preview__date">{date}</span>
      </div>
    </li>
  )
}

export default AdPreview
