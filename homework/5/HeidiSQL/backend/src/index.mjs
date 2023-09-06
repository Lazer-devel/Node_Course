import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import mysql from 'mysql2'
import cors from 'cors'

export const __dirname = dirname(fileURLToPath(import.meta.url))

const sqlConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './sqlConf.json'))
)

const sqlConnection = mysql.createConnection(sqlConf).promise()

const getDbShcemas = async () => {
  const dbStructure = []
  const [rows, _] = await sqlConnection.query('show databases')
  
  await Promise.all(rows.map((async (row) => {
    const {Database} = row
    const [rows,_] = await sqlConnection.query(`SHOW TABLES FROM ${Database}`)
    const tables = []
    rows.forEach(r => tables.push(r[`Tables_in_${Database}`]))
    dbStructure.push({name:Database, tables})
  })))

  return dbStructure
}

const app = express()
/**/
app.use(cors())
/**/
app.get('/schemas', async (req, res) => {
  const schemas = await getDbShcemas()
  res.send(JSON.stringify(schemas))
})



app.listen(10005, () => console.log('express started'))
