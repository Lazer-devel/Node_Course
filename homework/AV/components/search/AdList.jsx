import AdPreview from './AdPreview'

const AdList = ({ ads }) => {
  return (
    <>
      <h2
        className="announment-list__header title"
        data-testid="header"
      >{`Найдено ${ads.length} объявления`}</h2>
      <div className="announment-list">
        <ul className="announment-list__content" data-testid="ads-list">
          {ads.map((ad) => (
            <AdPreview key={ad.id} ad={ad} />
          ))}
        </ul>
      </div>
    </>
  )
}

export default AdList
