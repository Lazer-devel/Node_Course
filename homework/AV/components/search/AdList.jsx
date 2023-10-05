import AdPreview from './AdPreview'

const AdList = ({ ads }) => {
  return (
    <>
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

export default AdList
