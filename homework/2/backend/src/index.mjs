import express from 'express'
import cors from 'cors'

import streamToString from './utils.mjs'

const app = express()
app.use(cors())
app.use(express.json())

app.post('/fetch', async (req, res) => {
  const { url, method, headers, body } = req.body

  const response = await fetch(url, {
    method,
    headers,
    body,
  })

  const chunks = []
  for await (const chunk of response.body) {
    chunks.push(chunk)
  }

  res.json({
    status: response.status,
    headers: Object.fromEntries(response.headers),
    body: Buffer.concat(chunks).toString('utf8'),
  })
})

app.listen(10000, () => {
  console.log('start listen 10000 port')
})
