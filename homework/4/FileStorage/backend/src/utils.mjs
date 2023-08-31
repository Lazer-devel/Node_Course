import fs from 'fs'
import { nanoid } from 'nanoid'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'

export const __dirname = dirname(fileURLToPath(import.meta.url))

export function createProtocol(action, data) {
  return JSON.stringify({ action, data })
}
export function createFileConfig(id, name, comment, date) {
  return { id, name, comment, date }
}

export function createIndexFiles() {
  const folderPath = path.resolve(__dirname, '../fileStorage')
  const fileIndex = new Map()
  const fileConfig = getFileConfig()

  fs.readdirSync(folderPath).forEach((fileName) => {
    const fileStats = fs.statSync(path.resolve(folderPath, `${fileName}`))
    const fileConf = fileConfig.find(
      (file) =>
        file.name === fileName &&
        file.date === fileStats.birthtime.toISOString()
    )

    if (fileConf) {
      fileIndex.set(fileConf.id, fileConf)
      return
    }

    const fileId = nanoid()
    const fileObj = {
      name: fileName,
      date: fileStats.birthtime,
      id: fileId,
    }
    fileIndex.set(fileId, fileObj)
  })
  return fileIndex
}

function getFileConfig() {
  const config = fs.readFileSync(path.resolve(__dirname, './filesConfig.json'))
  return JSON.parse(config.toString())
}
