import fs from 'fs/promises'
import express from 'express'
import path from 'path'

import statToHtml from './utils'

const app = express()
const electionsPath = `./src/elections.json`

let elections: Map<string, { name: string; votes: number }>

app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

fs.readFile(electionsPath, {
  encoding: 'utf-8',
}).then((initData: string) => {
  elections = new Map(Object.entries(JSON.parse(initData)))
  app.listen(10001)
  console.log('Server start listen port 10001')
})

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'))
})

app.post('/downloadStat', (req, res) => {
  switch (req.headers.accept) {
    case 'text/html':
      return res.send(statToHtml(JSON.stringify([...elections.values()])))
    case 'application/xml': {
      const xmlData: string = [...elections.values()]
        .map(
          (el) =>
            `<result><name>${el.name}</name><votes>${el.votes}</votes></result>`
        )
        .join('')

      return res.send(`<elections>${xmlData}</elections>`)
    }
    default:
      return res.json([...elections.values()])
  }
})

app.get('/variants', (_, res) => {
  const variants = [...elections.entries()].map((arr) => {
    return { id: arr[0], name: arr[1].name }
  })
  res.json(variants)
})

app.post('/stat', (_, res) => {
  res.json(Object.fromEntries(elections))
})

app.post('/vote', (req, res) => {
  elections.get(req.body.id)!.votes++
  fs.writeFile(
    electionsPath,
    JSON.stringify(Object.fromEntries(elections))
  ).then(() => res.send())

  res.json(Object.fromEntries(elections))
})
