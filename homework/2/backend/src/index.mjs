import express from 'express'
import cors from 'cors'

import { createProxyResponse } from './utils.mjs'

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

  res.json(await createProxyResponse(response))
})

app.listen(10000, () => {
  console.log('start listen 10000 port')
})
