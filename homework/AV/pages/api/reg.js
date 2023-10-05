import DbProvider from '../../database/DbProvider.js'

import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import getConfig from 'next/config'

const mailTransporter = nodemailer.createTransport(
  getConfig().serverRuntimeConfig.mail
)

function createLetter(reciever, id) {
  return {
    from: 'niklazq9@gmail.com',
    to: `${reciever}`,
    subject: 'FileStorage Registration',
    html: `<a href="http://localhost:3000/registration?id=${id}">Click Me!</a>`,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  await DbProvider.init()

  const { login, password } = req.body

  if (await DbProvider.isUserExist(login)) {
    return res.status(400).json({ status: 400, message: 'login already exist' })
  }

  const id = await bcrypt.hash(login, 10)
  const newUser = await DbProvider.regUser(id, login, password)

  if (!newUser) {
    return res
      .status(500)
      .json({ status: 500, message: 'invalid registration' })
  }

  mailTransporter.sendMail(createLetter(login, id), (err, info) => {
    if (err) {
      console.log(err.message)
      return res
        .status(500)
        .json({ status: 500, message: 'invalid registration' })
    }
  })

  res.json({ status: 200 })
}
