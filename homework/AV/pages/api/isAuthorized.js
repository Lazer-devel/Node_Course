import DbProvider from '../../database/DbProvider.js'

export default async function handler(req, res) {
  const token = req.cookies.token
  if (token) {
    await DbProvider.init()
    const login = await DbProvider.isSessionExist(token)
    if (login) {
      return res.status(200).json(login)
    }
  }
  return res.status(401).send()
}
