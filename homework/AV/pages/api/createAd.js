import DbProvider from '../../database/DbProvider.js'

import busboy from 'busboy'
import { nanoid } from 'nanoid'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.send(400)
  }
  await DbProvider.init()
  const token = req.cookies.token
  const bb = busboy({ headers: req.headers })

  const id = nanoid()
  const temporaryFolderPath = `${process.env.STATIC_FOLDER}/uploading/${id}`

  await fs.promises.mkdir(temporaryFolderPath, { recursive: true })

  let mark,
    model,
    generation,
    year,
    volume,
    cost,
    comment = ''
  let photoAmount = 0

  const fileHandler = (_, file, info) => {
    ++photoAmount
    const fileExtension = Buffer.from(info.filename, 'latin1')
      .toString('utf-8')
      .split('.')
      .pop()

    const writer = fs.createWriteStream(
      `${temporaryFolderPath}/${photoAmount}.${fileExtension}`
    )

    writer.on('error', (err) => {
      console.log(err.message)
    })
    file.pipe(writer)
  }

  const fieldHandler = (name, value) => {
    switch (name) {
      case 'mark': {
        mark = value
        return
      }

      case 'model': {
        model = value
        return
      }
      case 'generation': {
        generation = value
        return
      }
      case 'year': {
        year = value
        return
      }
      case 'volume': {
        volume = value
        return
      }
      case 'cost': {
        cost = value
        return
      }
      case 'comment': {
        comment = value
        return
      }
    }
  }

  const errorHandler = (err) => {
    console.log(err.message)
    res.status(500).send('Ошибка обработки запроса')
  }

  const finishHandler = async () => {
    mark = await DbProvider.getMarkIdByName(mark)
    model = await DbProvider.getModelIdByName(model)
    generation = await DbProvider.getGenerationIdByName(generation)

    await DbProvider.createAd(
      token,
      id,
      mark,
      model,
      generation,
      year,
      volume,
      cost,
      comment,
      photoAmount
    )

    const folderPath = `${process.env.STATIC_FOLDER}/ad/${mark}/${model}/${generation}/${id}`

    await fs.promises.mkdir(folderPath, { recursive: true })

    await fs.promises.cp(temporaryFolderPath, folderPath, { recursive: true })

    bb.off('file', fileHandler)
    bb.off('field', fieldHandler)
    bb.off('error', errorHandler)
    bb.off('finish', finishHandler)
    res.send()
  }

  bb.on('file', fileHandler)
  bb.on('field', fieldHandler)
  bb.on('error', errorHandler)
  bb.on('finish', finishHandler)

  req.pipe(bb)
}
