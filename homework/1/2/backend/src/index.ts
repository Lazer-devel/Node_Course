import express from 'express'
import { engine } from 'express-handlebars'

var path = require('path')

const app = express()

const _login: string = 'qwe'
const _password: string = '123'

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.resolve('public')))
app.use(express.urlencoded({ extended: true }))

app.get('/auth', (_, res) => {
  console.log('GET')
  res.render('auth-page', {
    layout: 'auth-layout'
  })
})

app.get('/successAuth', (_, res) => {
  console.log('success auth')
  res.render('success-auth-page', {
    layout: 'auth-layout'
  })
})

app.post('/validate', (req, res) => {
  console.log('POST')
  const { login, password } = req.body
  if (_login === login && _password === password) {
    res.redirect('/successAuth')
    return
  }
  res.render('auth-page', {
    layout: 'auth-layout',
    login: login?.toString(),
    password: password?.toString(),
    err: login ? 'Ошибка авторизации' : ''
  })
})

app.listen(10002)
