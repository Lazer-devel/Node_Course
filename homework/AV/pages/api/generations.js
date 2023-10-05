import DbProvider from '../../database/DbProvider.js'

export default async function handler(req, res) {
  await DbProvider.init()
  const { mark, model } = req.query
  res.json(await DbProvider.getGenerations(mark, model))
}
