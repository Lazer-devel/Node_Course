import { WebSocketServer } from 'ws'
import busboy from 'busboy'
import express from 'express'
import { nanoid } from 'nanoid'
import fs from 'fs'
import cors from 'cors'
import mysql from 'mysql2'
import path from 'path'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'

import {
  createIndexFiles,
  createFileConfig,
  createProtocol,
  createLetter,
} from './utils.mjs'
import { EXPRESS_PORT, WEBSOCKET_SERVER_PORT, __dirname } from './constants.mjs'

const sqlConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './sqlConf.json'))
)
const dbPool = mysql.createPool(sqlConf).promise()

var mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'niklazq9@gmail.com',
    pass: 'xudqhogqtfqgojqh',
  },
})

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.resolve(__dirname, './static')))
app.use(cors())

const fileIndex = createIndexFiles()
const uploadStatus = new Map() // key:uploadId - value:ws

/*app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})*/

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

app.post('/reg', async (req, res) => {
  const { email, password } = req.body

  const [row, _] = await dbPool.query(
    `SELECT id FROM users WHERE login = '${email}'`
  )
  if (row.length) {
    res.json({ status: 'err', content: 'login already exist' })
    return
  }
  const id = await bcrypt.hash(email, 10)

  try {
    await dbPool.query(
      `INSERT INTO users VALUES ('${id}','${email}', '${password}', 0, NOW())`
    )
  } catch (err) {
    res.json({ status: 'err', content: 'invalid registration' })
  }

  mailTransporter.sendMail(createLetter(email, id), (err, info) => {
    if (err) {
      res.json({ status: 'err', content: 'oops, something went wrong' })
      return
    }
  })
  res.json({ status: 'ok', content: null })
})

app.get('/proofEmail', async (req, res) => {
  const id = req.query.id

  res.setHeader('Cache-control', `no-store`)

  const [row, _] = await dbPool.query(
    `SELECT id, isProofEmail FROM users WHERE id = '${id}'`
  )

  if (!row.length || row[0].isProofEmail) {
    res.sendFile(path.resolve(__dirname, './static/errorReg.html'))
    return
  }

  try {
    await dbPool.query(`UPDATE users SET isProofEmail = 1 WHERE id = '${id}'`)
    res.sendFile(path.resolve(__dirname, './static/successReg.html'))
  } catch (err) {
    res.status(501).send()
  }
})

app.post('/auth', async (req, res) => {
  const { login, password } = req.body
  // 1 путь 2) пришёл логин и пароль

  /*
  генерирую токен и отдаю
   */
})

app.listen(EXPRESS_PORT, () => {
  console.log('express server started')
})

const wss = new WebSocketServer({ port: WEBSOCKET_SERVER_PORT })
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
