import { WebSocketServer } from 'ws'
import path from 'path'
import busboy from 'busboy'
import express from 'express'
import { nanoid } from 'nanoid'
import fs, { write } from 'fs'
import cors from 'cors'
import {
  createIndexFiles,
  createFileConfig,
  __dirname,
  createProtocol,
} from './utils.mjs'

const EXPRESS_PORT = 10004
const WEBSOCKET_SERVER_PORT = 55555

const app = express()
app.use(express.static(path.resolve(__dirname, './client/build')))

const wss = new WebSocketServer({ port: WEBSOCKET_SERVER_PORT })
const fileIndex = createIndexFiles()
const uploadStatus = new Map() // key:uploadId - value:ws

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.get('/getFileList', (_, res) => {
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.json([...fileIndex.values()])
})

app.get('/download', (req, res) => {
  const fileName = req.query.filename
  const filePath = path.resolve(__dirname, `../fileStorage/${fileName}`)
  res.download(filePath)
})

app.post('/upload', (req, res) => {
  const bb = busboy({ headers: req.headers })
  let comment
  let uploadId

  bb.on('file', (_, file, info) => {
    const fileName = Buffer.from(info.filename, 'latin1').toString('utf-8')
    const filePath = path.resolve(__dirname, `../fileStorage/${fileName}`)
    const writer = fs.createWriteStream(filePath)
    let uploadedLength = 0

    const reqChunkHandler = (chunk) => {
      uploadedLength += chunk.length
      const ws = uploadStatus.get(uploadId)
      const uploadedPercent = Math.round(
        (uploadedLength / req.headers['content-length']) * 100
      )
      if (ws) {
        ws.send(createProtocol('uploadedPercent', uploadedPercent))
      }
    }

    const reqCleanupHandler = () => {
      req.off('data', reqChunkHandler)
      req.off('error', reqErrorHandler)
      req.off('end', reqCleanupHandler)
    }

    const reqErrorHandler = () => {
      writer.destroy()
      fs.promises.rm(filePath)
      reqCleanupHandler()
      res.status(500).send('Ошибка записи файла')
    }

    req.on('data', reqChunkHandler)
    req.on('error', reqErrorHandler)
    req.on('end', reqCleanupHandler)

    const writerCleanUp = () => {
      writer.off('error', writerErrorHandler)
      writer.off('finish', writerFinishHandler)
    }

    const writerErrorHandler = () => {
      fs.promises.rm(filePath)
      writerCleanUp()
      res.status(500).send('Ошибка записи файла')
    }

    const writerFinishHandler = async () => {
      const id = nanoid()
      const filebirth = (
        await fs.promises.stat(filePath)
      ).birthtime.toISOString()

      fileIndex.set(id, createFileConfig(id, fileName, comment, filebirth))
      fs.promises.writeFile(
        path.resolve(__dirname, './filesConfig.json'),
        JSON.stringify([...fileIndex.values()])
      )
      writerCleanUp()
      res.status(200).json([...fileIndex.values()])
    }

    writer.on('error', writerErrorHandler)
    writer.on('finish', writerFinishHandler)

    file.pipe(writer)
  })

  const bbOnField = (name, value) => {
    switch (name) {
      case 'comment':
        comment = value
        break
      case 'uploadId':
        uploadId = value
        break
      default:
        break
    }
  }

  const bbOnError = () => res.status(500).send('Ошибка обработки запроса')

  const bbOnFinish = () => {
    bb.off('field', bbOnField)
    bb.off('error', bbOnError)
    bb.off('finish', bbOnFinish)
  }

  bb.on('field', bbOnField)
  bb.on('error', bbOnError)
  bb.on('finish', bbOnFinish)

  req.pipe(bb)
})

// используется только для upload поэтому без api
wss.on('connection', (ws) => {
  const uploadId = nanoid()
  uploadStatus.set(uploadId, ws)

  ws.send(createProtocol('uploadId', uploadId))

  const wsCloseHandler = () => {
    uploadStatus.delete(uploadId)
    ws.off('close', wsCloseHandler)
    console.log('client close ws connection')
  }

  ws.on('close', wsCloseHandler)
})

app.listen(EXPRESS_PORT, () => {
  console.log('express server started')
})
