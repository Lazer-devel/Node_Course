import { argv, exit } from 'process'
import { isFolder, startScan } from './utils.mjs'
const PATH_ARG = 2

if (argv.length !== 3) {
  console.log('Ошибка: необходимо указать лишь путь к директории')
  exit(0)
}

const folderPath = argv[PATH_ARG]

// синхронная проверка, тк нечего выполнять в асинхронном режиме
if (!isFolder(folderPath)) {
  exit(0)
}

console.log(`Сканирование директории: ${folderPath}`)

startScan(folderPath).then(() => {
  console.log('Выполнение утилиты завершено')
  exit(1)
})
