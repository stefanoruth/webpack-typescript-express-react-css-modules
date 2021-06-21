import express from 'express'
import compression from 'compression'
import { ssr } from './ssr'
import path from 'path'
import cors from 'cors'

const app = express()

const publicFolder = path.resolve(__dirname, '../../dist/client')

app.use(cors())
app.use(compression())
app.use(express.static(publicFolder))
app.use(ssr())

app.listen(3000, () => {
    console.log('started')
})
