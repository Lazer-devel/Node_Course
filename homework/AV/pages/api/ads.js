import DbProvider from '../../database/DbProvider.js'

export default async function handler(req, res) {
  await DbProvider.init()
  res.json(await DbProvider.getAds(req.query))
}
