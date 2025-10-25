// src/routes/studentRoutes.js
import express from 'express'
import multer from 'multer'
import path from 'path'
import { listStudents, createStudent, updatePaymentStatus, updateCardStatus, deleteStudent } from '../controllers/studentController.js'

const router = express.Router()

// Configure multer for image uploads (use memory storage for Supabase)
const upload = multer({ 
  storage: multer.memoryStorage(), // Store in memory for Supabase upload
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})

router.get('/', listStudents)
router.post('/', upload.single('image'), createStudent)
router.patch('/:id/payment', updatePaymentStatus)
router.patch('/:id/card-status', updateCardStatus)
router.delete('/:id', deleteStudent)

export default router
