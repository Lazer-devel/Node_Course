import { WebSocketServer } from 'ws'
import busboy from 'busboy'
import express from 'express'
import { nanoid } from 'nanoid'
import fs from 'fs'
import mysql from 'mysql2'
import path from 'path'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import cookieParser from 'cookie-parser'

import { createFileConfig, createProtocol, createLetter } from './utils.mjs'
import { EXPRESS_PORT, WEBSOCKET_SERVER_PORT, __dirname } from './constants.mjs'

const sqlConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './sqlConf.json'))
)

const mailConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './mailConf.json'))
)

const dbPool = mysql.createPool(sqlConf).promise()
var mailTransporter = nodemailer.createTransport(mailConf)

const app = express()

const authCheck = async (req, res, next) => {
  if (req.cookies.token) {
    const [rows, _] = await dbPool.query(
      `SELECT COUNT(*) as exist FROM sessions WHERE token = '${req.cookies.token}'`
    )

    if (rows.length && rows[0].exist) {
      dbPool.query(
        `UPDATE sessions SET lastAccess = NOW() WHERE token = '${req.cookies.token}'`
      )
      return req.url.includes('validateToken') ? res.status(200).send() : next()
    }
  }
  return res.status(401).send({ status: 'unauthorized' })
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, './static/client')))

const uploadStatus = new Map() // key:uploadId - value:ws

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, './static/client/index.html'))
})

app.post('/validateToken', authCheck)

app.post('/auth', async (req, res) => {
  const { login, password } = req.body
  const [rows, _] = await dbPool.query(
    `SELECT login, password, isActivated FROM users WHERE login = '${login}' AND password = '${password}'`
  )
  // 1 запись о пользователе
  const user = rows.shift()
  if (!user) {
    return res.json({ status: 'err', content: 'invalid login or password' })
  }

  if (!user.isActivated) {
    return res.json({ status: 'err', content: 'login is inactive' })
  }

  try {
    const token = await bcrypt.hash(login, 10)

    const [rows, _] = await dbPool.query(
      `SELECT id FROM users WHERE login = '${login}'`
    )
    const userId = rows.shift().id

    await dbPool.query(
      `INSERT INTO sessions VALUES ('${token}', '${userId}', NOW())  `
    )

    res
      .cookie('token', token, {
        secure: false,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000,
        path: '/',
        sameSite: 'strict',
      })
      .send({ status: 'ok' })
  } catch (err) {
    res.status(501).json({ status: 'err', content: 'authorized error' })
  }
})

app.post('/reg', async (req, res) => {
  const { email, password } = req.body

  const [rows, _] = await dbPool.query(
    `SELECT id FROM users WHERE login = '${email}'`
  )
  if (rows.length) {
    return res.json({ status: 'err', content: 'login already exist' })
  }

  const id = await bcrypt.hash(email, 10)

  try {
    await dbPool.query(
      `INSERT INTO users VALUES ('${id}','${email}', '${password}', 0, NOW())`
    )
  } catch (err) {
    return res
      .status(501)
      .json({ status: 'err', content: 'invalid registration' })
  }

  mailTransporter.sendMail(createLetter(email, id), (err, info) => {
    if (err) {
      return res
        .status(501)
        .json({ status: 'err', content: 'oops, something went wrong' })
    }
  })
  res.json({ status: 'ok', content: null })
})

app.get('/proofEmail', async (req, res) => {
  const id = req.query.id

  res.setHeader('Cache-control', `no-store`)

  const [rows, _] = await dbPool.query(
    `SELECT id, isActivated FROM users WHERE id = '${id}'`
  )

  if (!rows.length || rows[0].isActivated) {
    return res.sendFile(path.resolve(__dirname, './static/errorReg.html'))
  }

  try {
    await dbPool.query(`UPDATE users SET isActivated = 1 WHERE id = '${id}'`)
    res.sendFile(path.resolve(__dirname, './static/successReg.html'))
  } catch (err) {
    res.status(501).send()
  }
})

app.get('/getFileList', authCheck, async (req, res) => {
  const token = req.cookies.token

  const [rows, _] = await dbPool.query(
    `SELECT id, name, comment, loadDate FROM files WHERE userId = (SELECT userId FROM sessions WHERE token = '${token}')`
  )
  res.setHeader('Cache-Control', 'public, max-age=0')
  res.json(rows)
})

app.get('/download', authCheck, async (req, res) => {
  const token = req.cookies.token

  const fileName = req.query.filename
  {
    const [rows, _] = await dbPool.query(
      `SELECT name FROM files WHERE userId = (SELECT userId FROM sessions WHERE token = '${token}')`
    )
    console.log(rows)
    if (!rows.find((row) => row.name === fileName)) {
      return res.status(404).send()
    }
  }
  const filePath = path.resolve(__dirname, `../fileStorage/${fileName}`)
  res.download(filePath)
})

app.post('/upload', authCheck, async (req, res) => {
  const token = req.cookies.token
  const [rows, _] = await dbPool.query(
    `SELECT userId FROM sessions WHERE token = '${token}'`
  )
  const { userId } = rows.shift()

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
      await dbPool.query(
        `INSERT INTO files (userId, name, loadDate, comment) VALUES ('${userId}','${fileName}', NOW(),'${comment}')`
      )

      writerCleanUp()

      {
        const [rows, _] = await dbPool.query(
          `SELECT id, name, comment, loadDate FROM files WHERE userId = '${userId}'`
        )
        res.status(200).json(rows)
      }
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
