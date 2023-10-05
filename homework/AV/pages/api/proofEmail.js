import DbProvider from '../../database/DbProvider.js'

export default async function handler(req, res) {
  await DbProvider.init()
  const id = req.query.id

  res.setHeader('Cache-control', `no-store`)

  if (await DbProvider.isUserActivated(id)) {
    return res
      .status(400)
      .json({ status: 500, message: 'user already activated' })
  }

  const [isUpdated] = await DbProvider.setUserActive(id)

  if (!isUpdated) {
    return res
      .status(500)
      .json({ status: 500, message: 'invalid registration' })
  }

  return res
    .status(200)
    .json({ status: 200, message: 'Registration is success' })
}
