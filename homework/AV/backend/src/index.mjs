import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import cookieParser from 'cookie-parser'
import fs from 'fs'

import { EXPRESS_PORT } from './constants.mjs'
import DbProvider from './dataBase/dbProvider.mjs'
import path from 'path'
import { __dirname } from './constants.mjs'

DbProvider.init()

const mailConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './mailConf.json'))
)

const mailTransporter = nodemailer.createTransport(mailConf)

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'static')))

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

app.get('/main', async (_, res) => {
  const data = await DbProvider.getAnnoumentsByMark()
  res.json(data)
})

app.get('/annoumentsCount', async (req, res) => {
  const count = await DbProvider.getAnnoumentsCount(req.query)
  res.json(count)
})

app.get('/modelAnnouments', async (req, res) => {
  const mark = req.query.mark
  const modelAnnouments = await DbProvider.getAnnoumentsByModel(mark)
  res.json(modelAnnouments)
})

app.get('/marks', async (_, res) => {
  const marks = await DbProvider.getMarks()
  res.json(marks)
})
app.get('/models', async (req, res) => {
  const mark = req.query.mark
  const models = await DbProvider.getModels(mark)
  res.json(models)
})

app.get('/generations', async (req, res) => {
  const mark = req.query.mark
  const model = req.query.model

  const generations = await DbProvider.getGenerations(mark, model)
  console.log(generations)
  res.json(generations)
})

app.listen(EXPRESS_PORT, () => console.log('express started'))
