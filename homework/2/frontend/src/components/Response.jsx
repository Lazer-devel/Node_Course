import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

function Response({ data }) {
  const { status, headers, body } = data
  const isPreview = () => {
    const contentType = headers['content-type']
    return (
      contentType &&
      (contentType.includes('text/html') || contentType.includes('image'))
    )
  }

  const createImage = () => {
    return <img src={body} style={{ width: '200px', height: '200px' }} alt="" />
  }
  return (
    status && (
      <div className="response">
        <h2 className="response__header">Ответ на запрос:</h2>
        <label className="response__status label">
          Статус ответа: {status}
        </label>
        <ul className="response__header-list">
          Заголовки ответа:
          {Object.keys(headers).map((key) => (
            <li className="response__header">{`${key}: ${headers[key]}`}</li>
          ))}
        </ul>
        <div className="response__body-wrapper">
          <h3 className="response__body-header">Тело ответа:</h3>
          <Tabs className="response__body-tab">
            <TabList>
              <Tab>Тело</Tab>
              {isPreview() && <Tab>Предпросмотр</Tab>}
            </TabList>
            <TabPanel>{body}</TabPanel>
            {isPreview() && <TabPanel>{createImage()}</TabPanel>}
          </Tabs>
        </div>
      </div>
    )
  )
}

export default Response
