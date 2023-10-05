import DbProvider from '../../database/DbProvider.js'

export default async function handler(req, res) {
  await DbProvider.init()
  const mark = req.query.mark
  res.json(await DbProvider.getModels(mark))
}
