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
    from: 'niklazq9@gmail.com',
    to: `${reciever}`,
    subject: 'FileStorage Registration',
    html: `<a href="http://167.99.141.158:10004/proofEmail?id=${id}">Click Me!</a>`,
  }
}
