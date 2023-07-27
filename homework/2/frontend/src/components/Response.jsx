import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

function Response({ data }) {
  const { status, headers, body, err } = data

  if (err) {
    return <h1>Ошибка: {err}</h1>
  }
  const isPreview = () => {
    const contentType = headers['content-type']
    return (
      contentType &&
      (contentType.includes('text/html') || contentType.includes('image'))
    )
  }

  const createPreview = () => {
    if (headers['content-type'].includes('image')) {
      return (
        <img src={body} style={{ width: '400px', height: '400px' }} alt="" />
      )
    }
    return (
      <div
        dangerouslySetInnerHTML={{ __html: body }}
        style={{ position: 'relative' }}
      />
    )
  }

  return (
    status && (
      <div className="response">
        <h2 className="response__header">Ответ на запрос:</h2>
        <label className="response__status label">
          Статус ответа: {status}
        </label>
        <div className="response__header-wrapper">
          <label className="response__header-title label">
            Заголовки ответа:
          </label>
          <ul className="response__header-list">
            {Object.keys(headers).map((key) => (
              <li
                className="response__header"
                key={key}
              >{`${key}: ${headers[key]}`}</li>
            ))}
          </ul>
        </div>
        <div className="response__body-wrapper">
          <h3 className="response__body-header">Тело ответа:</h3>
          <Tabs className="response__body-tab">
            <TabList>
              <Tab>Тело</Tab>
              {isPreview() && <Tab>Предпросмотр</Tab>}
            </TabList>
            <TabPanel>{body}</TabPanel>
            {isPreview() && <TabPanel>{createPreview()}</TabPanel>}
          </Tabs>
        </div>
      </div>
    )
  )
}

export default Response
