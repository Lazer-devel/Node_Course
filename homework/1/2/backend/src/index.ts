import express from 'express'
import { createAuth } from './utils'
var path = require('path')

const app = express()

const _login: string = 'qwe'
const _password: string = '123'

app.use(express.static(path.resolve('public')))
app.use(express.urlencoded({ extended: true }))

app.get('/auth', (req, res: any) => {
  console.log('GET')
  if (req.query.login) {
    const { login, password } = req.query
    res.send(
      createAuth(login.toString(), password?.toString(), 'Ошибка авторизации')
    )
    return
  }
  res.send(createAuth())
})

app.post('/validate', (req, res) => {
  console.log('POST')
  const { login, password } = req.body
  if (_login === login && _password === password) {
    res.json(req.body)
    return
  }
  res.redirect(`/auth?login=${login}&password=${password}`)
})

app.listen(10002)
