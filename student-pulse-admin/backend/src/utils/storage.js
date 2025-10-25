// src/utils/storage.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export async function uploadStudentPhoto(file) {
  const fileName = `${Date.now()}-${file.originalname}`
  const filePath = `students/${fileName}`

  const { data, error } = await supabase.storage
    .from('student-photos')
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload photo: ${error.message}`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('student-photos')
    .getPublicUrl(filePath)

  return publicUrl
}

export async function deleteStudentPhoto(photoURL) {
  if (!photoURL) return

  // Extract file path from URL
  const urlParts = photoURL.split('/student-photos/')
  if (urlParts.length < 2) return

  const filePath = urlParts[1]

  const { error } = await supabase.storage
    .from('student-photos')
    .remove([filePath])

  if (error) {
    console.error('Error deleting photo:', error)
  }
}