import DbProvider from '../../database/DbProvider.js'

export default async function handler(req, res) {
  await DbProvider.init()
  const modelAnnouments = await DbProvider.getAnnoumentsByModel(req.query.mark)
  res.status(200).json(modelAnnouments)
}
