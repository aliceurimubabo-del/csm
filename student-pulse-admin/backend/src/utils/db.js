// src/utils/db.js
import dotenv from 'dotenv'
dotenv.config()

export async function fetchStudents() {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Student?select=*&order=id.desc`
  console.log('Fetching from:', url)
  
  const res = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Supabase error:', res.status, errorText)
    throw new Error(`Failed to fetch students: ${res.statusText} - ${errorText}`)
  }

  return await res.json()
}

export async function fetchStudentById(id) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Student?id=eq.${id}&select=*`
  console.log('Fetching student by ID:', id)
  
  const res = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Supabase error:', res.status, errorText)
    throw new Error(`Failed to fetch student: ${res.statusText} - ${errorText}`)
  }

  const result = await res.json()
  return result[0]
}

export async function createStudent(data) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Student`
  console.log('Posting to:', url)
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Failed to create student: ${res.statusText}`)
  }

  const result = await res.json()
  return result[0]
}

export async function updateStudent(id, data) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Student?id=eq.${id}`
  console.log('Updating student:', id, data)
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Failed to update student: ${res.statusText}`)
  }

  const result = await res.json()
  return result[0]
}

export async function deleteStudent(id) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Student?id=eq.${id}`
  console.log('Deleting student:', id)
  
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Failed to delete student: ${res.statusText}`)
  }
}

export async function getStudentsByClass(category, classLevel) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Student?category=eq.${category}&classLevel=eq.${classLevel}&select=*`
  console.log('Fetching students by class:', category, classLevel)
  
  const res = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Supabase error:', res.status, errorText)
    throw new Error(`Failed to fetch students by class: ${res.statusText}`)
  }

  return await res.json()
}

export async function getAttendance(date) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Attendance?date=eq.${date}&select=*`
  console.log('Fetching attendance for date:', date)
  
  const res = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
    },
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Supabase error:', res.status, errorText)
    throw new Error(`Failed to fetch attendance: ${res.statusText}`)
  }

  return await res.json()
}

export async function saveAttendance(records) {
  const url = `${process.env.SUPABASE_URL}/rest/v1/Attendance`
  console.log('Saving attendance records:', records.length)
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(records),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || `Failed to save attendance: ${res.statusText}`)
  }

  return await res.json()
}