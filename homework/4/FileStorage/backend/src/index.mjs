import { WebSocketServer, createWebSocketStream } from 'ws'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { api } from './api.mjs'
import express from 'express'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

app.listen(10004, () => {
  console.log('express server started')
})

let size = 0
app.post('/upload', (req, res) => {
  console.log('upload file')
  const writeStream = fs.createWriteStream(
    path.resolve(__dirname, '../fileStorage/1.txt')
  )
  req.on('data', (chunk) => (size += chunk.length))
  writeStream.on('finish', () => {
    res.status(200).send()
    console.log(size)
  })
  req.pipe(writeStream)
})
//

/*const fileList = []
const wss = new WebSocketServer({ port: 10004 }, () => {
  console.log(`wss's listening port: 10004`)
})

wss.on('connection', (ws) => {
  const stream = createWebSocketStream(ws)
  const writer = fs.createWriteStream(
    path.resolve(__dirname, '../fileStorage/1.txt')
  )
  const writers = []
  stream.pipe(writer)

  stream.on('close', () => console.log('close'))

  ws.on('close', (code, reason) => {
    console.log(
      `Client closed connection. Code: ${code} Reason: ${reason.toString()}`
    )
  })

  //stream.on
  /* const writer = fs.createWriteStream(
    path.resolve(__dirname, '../fileStorage/1.txt')
  )*/
/*ws.on('message', (protocol) => {
    const writer = fs.createWriteStream(
      path.resolve(__dirname, '../fileStorage/1.txt')
    )
    stream.pipe(writer)
  })
})*/
