import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import os from 'os'

export async function isFolder(path) {
  try {
    await fs.promises.access(path, fs.constants.R_OK | fs.constants.W_OK)
    const stats = await fs.promises.stat(path)

    if (!stats.isDirectory()) {
      console.log('Указанный путь не является директорией')
      return false
    }
  } catch (err) {
    console.log(err.message)
    return false
  }
  return true
}

function createGzip(filePath) {
  console.log(`Создаётся архив для ${filePath}`)
  return new Promise((resolve) => {
    const compression = zlib.createGzip()
    const stream = fs
      .createReadStream(filePath)
      .pipe(compression)
      .pipe(fs.createWriteStream(`${filePath}.gz`))

    stream.on('finish', () => {
      console.log(`Архив для ${filePath} успешно создан`)
      resolve()
    })
  })
}

export async function startScan(folderPath) {
  return new Promise(async (resolve) => {
    const queueSize = os.cpus().length
    let _gzQueue = []

    const archive = async (filePath) => {
      if (_gzQueue.length > queueSize - 1) {
        await Promise.race(_gzQueue.slice(0, queueSize - 1))
      }
      const gzPromise = createGzip(filePath).then(() => {
        _gzQueue = _gzQueue.filter((p) => p !== gzPromise)
        if (!_gzQueue.length) {
          resolve()
        }
      })
      _gzQueue.push(gzPromise)
    }

    const scanDir = async (folderPath) => {
      let fileNames
      try {
        fileNames = await fs.promises.readdir(folderPath)
      } catch (err) {
        console.log(
          `Возникла ошибка в ходе сканирования директории: ${err.message}`
        )
        return
      }
      /*
       * возвращается отсортированный список, но в спецификации про это ничего не сказано =>
       * сортируем сами, если так и есть, то дополнительно будет сделано O(n-1) сравнений
       */
      fileNames.sort()

      /*
       *   За O(n) операций сравнения определяем есть ли архив и что далее делать
       *   В результате лексикографической сортировки, если существует файл и его заархивированная копия,
       *   то сначала в массиве идёт файл, а затем архив ([0] - 1.txt, [1] - 1.txt.gz)
       */

      for (let i = 0; i < fileNames.length; i++) {
        // если вдруг затесался архив без своего родителя
        if (fileNames[i].substring(fileNames[i].lastIndexOf('.')) === '.gz') {
          continue
        }
        const currentPath = path.resolve(folderPath, fileNames[i])
        const currentStats = await fs.promises.stat(currentPath)

        if (currentStats.isFile()) {
          // если попали в последний файл, то он точно не имеет архивную копию
          if (i === fileNames.length - 1) {
            await archive(currentPath)
            continue
          }

          const nextPath = path.resolve(folderPath, fileNames[i + 1])
          const nextStats = await fs.promises.stat(nextPath)

          // если нашли файл и его архив
          if (nextStats.isFile() && `${fileNames[i]}.gz` === fileNames[i + 1]) {
            // проверям актуален ли архив
            if (currentStats.mtime < nextStats.mtime) {
              // время модификации архива больше чем файла => переход на след итерацию
              // в сумме смещаемся на 2 элемента
              i += 1
              continue
            }
            console.log(`Найден устаревший архив для ${currentPath}`)
          }
          // для файла с индексом i создаём архив
          await archive(currentPath)
        } else {
          await scanDir(currentPath)
        }
      }
    }
    await scanDir(folderPath)
  })
}
