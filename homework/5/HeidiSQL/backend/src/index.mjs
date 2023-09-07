import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import mysql from 'mysql2'
import cors from 'cors'
import { modifyTableType } from './utils.mjs'

export const __dirname = dirname(fileURLToPath(import.meta.url))

const sqlConf = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './sqlConf.json'))
)

const pool = mysql.createPool(sqlConf).promise()

const getDbShcemas = async () => {
  const dbStructure = []
  const [rows, _] = await pool.query('show databases')

  await Promise.all(
    rows.map(async (row) => {
      const { Database } = row
      const [rows, _] = await pool.query(`SHOW FULL TABLES FROM ${Database}`)
      const tables = []
      rows.forEach((r) =>
        tables.push({
          name: r[`Tables_in_${Database}`],
          type: modifyTableType(r['Table_type']),
        })
      )
      dbStructure.push({ name: Database, tables })
    })
  )

  return dbStructure
}

const app = express()
app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(express.json())

app.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.get('/schemas', async (req, res) => {
  const schemas = await getDbShcemas()
  res.send(JSON.stringify(schemas))
})

app.post('/query', async (req, res) => {
  const createResponceBody = (status, data) => {
    return { status, data }
  }
  try {
    const [rows, _] = await pool.query(req.body.query)
    // :)
    if (req.body.query.toUpperCase().includes('SELECT')) {
      return res.json(createResponceBody('ok', rows))
    }

    const infoString = `Найдено строк: ${rows.fieldCount} Затронуто строк: ${rows.affectedRows} Предупреждения: ${rows.warningStatus}`
    res.json(createResponceBody('info', infoString))
  } catch (err) {
    res.json(createResponceBody('err', err.message))
  }
})

app.listen(10005, () => console.log('express started'))
