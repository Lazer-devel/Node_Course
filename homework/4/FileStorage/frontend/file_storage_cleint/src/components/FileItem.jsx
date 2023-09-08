import downloadIcon from '../assets/download.svg'

function FileItem({ file, onLoadFailed, isHeader = false }) {
  const { name, date, comment } = file

  const downloadFile = async () => {
    try {
      const res = await fetch(
        `http://localhost:10004/download?filename=${name}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      )
      if (res.status === 200) {
        const blob = await res.blob()
        const href = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = href
        link.setAttribute('download', name)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return
      }
    } catch (err) {
      onLoadFailed()
    }
  }
  return (
    <div
      className={`file-table__item ${
        isHeader ? 'file-table__item--header' : ''
      }`}
    >
      <div className="file-table__item-name">{name}</div>
      <div className="file-table__item-comment">{comment}</div>
      <div className="file-table__item-date">{date}</div>
      {!isHeader && (
        <div className="file-table__item-download-wrapper">
          <img
            className="file-table__item-download"
            src={downloadIcon}
            alt=""
            title="download"
            onClick={downloadFile}
          ></img>
        </div>
      )}
    </div>
  )
}
export default FileItem
