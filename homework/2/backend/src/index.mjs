import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

import { createProxyResponse } from './utils.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.post('/fetch', async (req, res) => {
  const { url, method, headers, body } = req.body

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    res.json(await createProxyResponse(response))
  } catch (err) {
    res.json({ err: err.message })
  }
})

app.listen(10003, () => {
  console.log('start listen 10003 port')
})
