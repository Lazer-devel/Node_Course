import express from 'express'
import cors from 'cors'

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

  console.log(await response.json())

  res.json({
    status: response.status,
    headers: Object.fromEntries(response.headers),
    body: response.body,
  })
})

app.listen(10000, () => {
  console.log('start listen 10000 port')
})
