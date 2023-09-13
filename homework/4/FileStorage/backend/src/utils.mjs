import fs from 'fs'
import { nanoid } from 'nanoid'
import path from 'path'
import { __dirname } from './constants.mjs'

export function createProtocol(action, data) {
  return JSON.stringify({ action, data })
}
export function createFileConfig(id, name, comment, date) {
  return { id, name, comment, date }
}

export function createLetter(reciever, id) {
  return {
    from: 'niklazq94@gmail.com',
    to: `${reciever}`,
    subject: 'FileStorage Registration',
    html: `<a href="http://localhost:10004/proofEmail?id=${id}">Click Me!</a>`,
  }
}

function getFileConfig() {
  const config = fs.readFileSync(path.resolve(__dirname, './filesConfig.json'))
  return JSON.parse(config.toString())
}
