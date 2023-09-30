import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import bcrypt from 'bcrypt'
import busboy from 'busboy'
import { EXPRESS_PORT } from './constants.mjs'
import { nanoid } from 'nanoid'
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
    res.status(501).json({ status: 'err', content: 'authorized error' })
  }
})

app.get('/main', async (_, res) => {
  res.json(await DbProvider.getAnnoumentsByMark())
})

app.get('/annoumentsCount', async (req, res) => {
  res.json((await DbProvider.getAds(req.query)).length)
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
  res.json(generations)
})

app.get('/catalog', async (req, res) => {
  res.json(await DbProvider.getAds(req.params))
})
app.get('/catalog/:mark', async (req, res) => {
  res.json(await DbProvider.getAds(req.params))
})
app.get('/catalog/:mark/:model', async (req, res) => {
  res.json(await DbProvider.getAds(req.params))
})
app.get('/catalog/:mark/:model/:id', async (req, res) => {
  res.json((await DbProvider.getAds(req.params)).pop())
})

app.get('/filter', async (req, res) => {
  res.json(await DbProvider.getAds(req.query))
})

const checkAuth = async (req, res, next) => {
  const token = req.cookies.token
  if (token) {
    const login = await DbProvider.isSessionExist(token)
    if (login) {
      return req.url.includes('checkAuth') ? res.json(login) : next()
    }
  }
  return res.status(401).send()
}
app.post('/checkAuth', checkAuth)

app.post('/new_ad', checkAuth, async (req, res) => {
  const token = req.cookies.token
  const bb = busboy({ headers: req.headers })

  const id = nanoid()
  const temporaryFolderPath = path.resolve(
    __dirname,
    `./static/uploading/${id}`
  )
  await fs.promises.mkdir(temporaryFolderPath, { recursive: true })

  let mark,
    model,
    generation,
    year,
    volume,
    cost,
    comment = ''
  let photoAmount = 0

  const fileHandler = (_, file, info) => {
    ++photoAmount
    const fileExtension = Buffer.from(info.filename, 'latin1')
      .toString('utf-8')
      .split('.')
      .pop()

    const writer = fs.createWriteStream(
      `${temporaryFolderPath}/${photoAmount}.${fileExtension}`
    )
    file.pipe(writer)
  }

  const fieldHandler = (name, value) => {
    switch (name) {
      case 'mark': {
        mark = value
        return
      }

      case 'model': {
        model = value
        return
      }
      case 'generation': {
        generation = value
        return
      }
      case 'year': {
        year = value
        return
      }
      case 'volume': {
        volume = value
        return
      }
      case 'cost': {
        cost = value
        return
      }
      case 'comment': {
        comment = value
        return
      }
    }
  }

  const errorHandler = () => res.status(500).send('Ошибка обработки запроса')

  const finishHandler = async () => {
    mark = await DbProvider.getMarkIdByName(mark)
    model = await DbProvider.getModelIdByName(model)
    generation = await DbProvider.getGenerationIdByName(generation)

    await DbProvider.createAd(
      token,
      id,
      mark,
      model,
      generation,
      year,
      volume,
      cost,
      comment,
      photoAmount
    )

    const folderPath = path.resolve(
      __dirname,
      `./static/ad/${mark}/${model}/${generation}/${id}`
    )
    await fs.promises.mkdir(folderPath, { recursive: true })

    await fs.promises.cp(temporaryFolderPath, folderPath, { recursive: true })

    bb.off('file', fileHandler)
    bb.off('field', fieldHandler)
    bb.off('error', errorHandler)
    bb.off('finish', finishHandler)
    res.send()
  }

  bb.on('file', fileHandler)
  bb.on('field', fieldHandler)
  bb.on('error', errorHandler)
  bb.on('finish', finishHandler)

  req.pipe(bb)
})

app.listen(EXPRESS_PORT, () => console.log('express started'))
