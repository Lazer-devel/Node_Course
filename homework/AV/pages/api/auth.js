import DbProvider from '../../database/DbProvider.js'

import bcrypt from 'bcrypt'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return
  }

  DbProvider.init()

  const { login, password } = req.body

  const user = await DbProvider.getUser(login, password)

  if (!user) {
    return res
      .status(401)
      .json({ status: 401, message: 'invalid login or password' })
  }

  if (!user.isActivated) {
    return res.status(401).json({ status: 401, message: 'login is inactive' })
  }

  const token = await bcrypt.hash(login, 10)
  const session = await DbProvider.createSession(login, token)

  if (!session) {
    return res.status(500).json({ status: 500, message: 'authorized error' })
  }

  console.log(res.cookies)

  res.setHeader(
    'set-cookie',
    `token=${token}; Max-Age=86400; Path=/; HttpOnly; SameSite=Strict`
  )
  res.send({ status: 200 })
}
