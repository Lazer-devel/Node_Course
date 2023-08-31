import FileItem from './FileItem'

function FileTable({ fileList, onLoadFailed }) {
  const header = {
    name: 'Название',
    comment: 'Комментарий',
    date: 'Дата',
  }

  return (
    <div className="file-table">
      <FileItem file={header} isHeader={true} />
      <div className="file-table__body">
        {fileList.map((file) => (
          <FileItem key={file.id} file={file} onLoadFailed={onLoadFailed} />
        ))}
      </div>
    </div>
  )
}

export default FileTable
