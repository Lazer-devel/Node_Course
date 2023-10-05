import DbProvider from '../../database/DbProvider.js'

export default async function handler(req, res) {
  await DbProvider.init()
  res.status(200).json((await DbProvider.getAds()).length)
}
