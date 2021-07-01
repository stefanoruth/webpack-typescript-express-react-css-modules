import express from 'express'
import compression from 'compression'
import { ssr } from './ssr'
import path from 'path'
import cors from 'cors'

const app = express()

const port = 3000

const publicFolder = path.resolve(__dirname, '../../dist/client')

app.use(cors())
app.use(compression())
app.use(express.static(publicFolder))
app.use(ssr())

app.listen(port, () => {
    console.log(`Started: http://localhost:${port}`)
})
