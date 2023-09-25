import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import bcrypt from 'bcrypt'

import { EXPRESS_PORT } from './constants.mjs'
import DbProvider from './dataBase/dbProvider.mjs'
import path from 'path'
import { __dirname } from './constants.mjs'
import { createLetter } from './utils.mjs'

DbProvider.init()

const mailConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './mailConf.json'))
)

const mailTransporter = nodemailer.createTransport(mailConf)

const app = express()
/****************************** */
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
/****************************** */
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'static')))

app.post('/reg', async (req, res) => {
  const { login, password } = req.body

  if (await DbProvider.isUserExist(login)) {
    return res.json({ status: 'err', content: 'login already exist' })
  }
  const id = await bcrypt.hash(login, 10)
  try {
    await DbProvider.regUser(id, login, password)
  } catch (_) {
    return res
      .status(501)
      .json({ status: 'err', content: 'invalid registration' })
  }

  mailTransporter.sendMail(createLetter(login, id), (err, info) => {
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

  if (await DbProvider.isUserActivated(id)) {
    return res.sendFile(path.resolve(__dirname, './static/errorReg.html'))
  }

  try {
    await DbProvider.setUserActive(id)
    res.sendFile(path.resolve(__dirname, './static/succedReg.html'))
  } catch (err) {
    res.status(501).send()
  }
})

app.post('/auth', async (req, res) => {
  const { login, password } = req.body

  const user = await DbProvider.getUser(login, password)

  if (!user) {
    return res.json({ status: 'err', content: 'invalid login or password' })
  }

  if (!user.isActivated) {
    return res.json({ status: 'err', content: 'login is inactive' })
  }

  try {
    const token = await bcrypt.hash(login, 10)

    await DbProvider.createSession(login, token)
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
    console.log(err.message)
    res.status(501).json({ status: 'err', content: 'authorized error' })
  }
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
  console.log(modelAnnouments)
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
