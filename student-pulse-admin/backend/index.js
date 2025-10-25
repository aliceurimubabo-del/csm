import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import studentRoutes from './src/routes/studentRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

app.use(cors())
app.use(express.json())
// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/students', studentRoutes)

const PORT = process.env.PORT || 5001
const HOST = '0.0.0.0'

app.listen(PORT, HOST, () => {
  console.log(`CSM backend listening on ${HOST}:${PORT}`)
})
