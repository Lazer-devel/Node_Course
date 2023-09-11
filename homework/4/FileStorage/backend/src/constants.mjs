import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const EXPRESS_PORT = 10004
export const WEBSOCKET_SERVER_PORT = 55555
export const __dirname = dirname(fileURLToPath(import.meta.url))
