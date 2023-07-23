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
    id: '1',
    url: 'https://petstore.swagger.io/v2/pet/0',
    method: 'GET',
    headers: new Map(),
    params: new Map(),
    body: '',
  },
  {
    id: '2',
    url: 'https://petstore.swagger.io/v2/pet',
    method: 'POST',
    headers: new Map([
      ['1qwer', { name: 'Content-type', value: 'application/json' }],
    ]),
    params: new Map(),
    body: `{
      "id": 0,
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
    id: '3',
    url: 'https://petstore.swagger.io/v2/pet',
    method: 'PUT',
    headers: new Map([
      ['rqwrqr1', { name: 'Content-type', value: 'application/json' }],
    ]),
    params: new Map(),
    body: `{
      "id": 0,
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
    id: 'dasfafa4',
    url: 'https://petstore.swagger.io/v2/pet/0',
    method: 'DELETE',
    headers: new Map(),
    params: new Map(),
    body: '',
  },
]
