// src/controllers/studentController.js
import { fetchStudents, fetchStudentById, createStudent as createStudentDB, updateStudent as updateStudentDB, deleteStudent as deleteStudentDB, getStudentsByClass as getStudentsByClassDB, getAttendance as getAttendanceDB, saveAttendance as saveAttendanceDB } from '../utils/db.js'
import { uploadStudentPhoto } from '../utils/storage.js'

export async function listStudents(req, res) {
  try {
    const students = await fetchStudents()
    res.json(students)
  } catch (err) {
    console.error('Error fetching students:', err)
    res.status(500).json({ error: err.message })
  }
}

export async function getStudentById(req, res) {
  try {
    const { id } = req.params
    const student = await fetchStudentById(id)
    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }
    res.json(student)
  } catch (err) {
    console.error('Error fetching student:', err)
    res.status(500).json({ error: err.message })
  }
}

export async function createStudent(req, res) {
  try {
    const { name, email, cardUID, class: studentClass } = req.body
    if (!name || !email || !cardUID) {
      return res.status(400).json({ error: 'name, email, and cardUID are required' })
    }
    
    // Prepare student data
    const studentData = {
      name,
      email,
      cardUID,
      class: studentClass || null,
    }
    
    // Handle image upload if present
    if (req.file) {
      try {
        const photoURL = await uploadStudentPhoto(req.file)
        studentData.photoURL = photoURL
      } catch (uploadErr) {
        console.error('Error uploading photo:', uploadErr)
        // Continue without photo if upload fails
      }
    }
    
    const student = await createStudentDB(studentData)
    res.status(201).json(student)
  } catch (err) {
    console.error('Error creating student:', err)
    res.status(500).json({ error: err.message })
  }
}

export async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params
    const { hasPaid } = req.body
    if (typeof hasPaid !== 'boolean') {
      return res.status(400).json({ error: 'hasPaid must be a boolean' })
    }
    const student = await updateStudentDB(id, { hasPaid })
    res.json(student)
  } catch (err) {
    console.error('Error updating payment status:', err)
    res.status(500).json({ error: err.message })
  }
}

export async function updateCardStatus(req, res) {
  try {
    const { id } = req.params
    const { cardStatus } = req.body
    if (!['active', 'blocked'].includes(cardStatus)) {
      return res.status(400).json({ error: 'cardStatus must be active or blocked' })
    }
    const student = await updateStudentDB(id, { cardStatus })
    res.json(student)
  } catch (err) {
    console.error('Error updating card status:', err)
    res.status(500).json({ error: err.message })
  }
}

export async function deleteStudent(req, res) {
  try {
    const { id } = req.params
    await deleteStudentDB(id)
    res.status(204).send()
  } catch (err) {
    console.error('Error deleting student:', err)
    res.status(500).json({ error: err.message })
  }
}
