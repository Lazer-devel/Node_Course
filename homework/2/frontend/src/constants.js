import { nanoid } from 'nanoid'

export const methods = ['GET', 'POST', 'PUT', 'DELETE']
export const reqHeaders = [
  'A-IM',
  'Accept',
  'Accept-Language',
  'Accept-Datetime',
  'Authorization',
  'Cache-Control',
  'Content-Type',
  'Forwarded',
  'From',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Max-Forwards',
  'Pragma',
  'Proxy-Authorization',
  'Range',
  'User-Agent',
  'Warning',
]

export const preSavedReq = [
  {
    id: nanoid(),
    name: 'Загрузить onliner',
    url: 'https://www.onliner.by/',
    method: 'GET',
    headers: new Map(),
    params: new Map(),
    body: '',
  },
  {
    id: nanoid(),
    name: 'Получить картинку',
    url: 'https://via.placeholder.com/600/771796',
    method: 'GET',
    headers: new Map(),
    params: new Map(),
    body: '',
  },
  {
    id: nanoid(),
    name: 'Получить животное (json)',
    url: 'https://petstore.swagger.io/v2/pet/100',
    method: 'GET',
    headers: new Map(),
    params: new Map(),
    body: '',
  },
  {
    id: nanoid(),
    name: 'Получить животное (xml)',
    url: 'https://petstore.swagger.io/v2/pet/100',
    method: 'GET',
    headers: new Map([
      [nanoid(), { name: 'Accept', value: 'application/xml' }],
    ]),
    params: new Map(),
    body: '',
  },
  {
    id: nanoid(),
    name: 'Создать животное (xml)',
    url: 'https://petstore.swagger.io/v2/pet',
    method: 'POST',
    headers: new Map([
      [nanoid(), { name: 'Content-type', value: 'application/xml' }],
      [nanoid(), { name: 'Accept', value: 'application/xml' }],
    ]),
    params: new Map(),
    body: `<?xml version="1.0" encoding="UTF-8"?>
    <Pet>
      <id>100</id>
      <Category>
        <id>0</id>
        <name>string</name>
      </Category>
      <name>doggie</name>
      <photoUrls>
        <photoUrl>string</photoUrl>
      </photoUrls>
      <tags>
        <Tag>
          <id>0</id>
          <name>string</name>
        </Tag>
      </tags>
      <status>available</status>
    </Pet>`,
  },
  {
    id: nanoid(),
    name: 'Cоздать животное (json)',
    url: 'https://petstore.swagger.io/v2/pet',
    method: 'POST',
    headers: new Map([
      [nanoid(), { name: 'Content-type', value: 'application/json' }],
    ]),
    params: new Map(),
    body: `{
      "id": 100,
      "category": {
        "id": 0,
        "name": "string"
      },
      "name": "doggie",
      "photoUrls": [
        "string"
      ],
      "tags": [
        {
          "id": 0,
          "name": "string"
        }
      ],
      "status": "available"
    }`,
  },
  {
    id: nanoid(),
    name: 'Изменить животное (json)',
    url: 'https://petstore.swagger.io/v2/pet',
    method: 'PUT',
    headers: new Map([
      [nanoid(), { name: 'Content-type', value: 'application/json' }],
    ]),
    params: new Map(),
    body: `{
      "id": 100,
      "category": {
        "id": 0,
        "name": "string"
      },
      "name": "UPDATED_doggie",
      "photoUrls": [
        "string"
      ],
      "tags": [
        {
          "id": 0,
          "name": "string"
        }
      ],
      "status": "available"
    }`,
  },
  {
    id: nanoid(),
    name: 'Удалить животное',
    url: 'https://petstore.swagger.io/v2/pet/100',
    method: 'DELETE',
    headers: new Map(),
    params: new Map(),
    body: '',
  },
]
