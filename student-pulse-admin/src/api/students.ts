export type Student = {
  id: number
  name: string
  email: string
  cardUID: string
  hasPaid: boolean
  cardStatus: 'active' | 'blocked' | 'active'
  institutionId?: number | null
  photoURL?: string | null
  image?: string | null
  class?: string | null
  category?: string | null
  classLevel?: string | null
  program?: string | null
  age?: number | null
  created_at?: string
  lastAccess?: string
}

export type Attendance = {
  id: number
  studentId: number
  date: string
  status: 'present' | 'absent'
  createdAt?: string
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export async function getStudents(_institutionId: number): Promise<Student[]> {
  const res = await fetch(`${BASE_URL}/api/students`)
  if (!res.ok) throw new Error('Failed to fetch students')
  return res.json()
}

export async function getStudentById(studentId: number): Promise<Student> {
  const res = await fetch(`${BASE_URL}/api/students/${studentId}`)
  if (!res.ok) throw new Error('Failed to fetch student details')
  return res.json()
}

export async function createStudent(
  data: { name: string; email: string; cardUID: string; image?: File; class?: string },
  _institutionId: number
): Promise<Student> {
  // If there's an image file, use FormData, otherwise use JSON
  if (data.image) {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('cardUID', data.cardUID)
    if (data.class) formData.append('class', data.class)
    formData.append('image', data.image)

    const res = await fetch(`${BASE_URL}/api/students`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to add student')
    }
    return res.json()
  } else {
    // No image, send JSON
    const res = await fetch(`${BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        cardUID: data.cardUID,
        class: data.class,
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to add student')
    }
    return res.json()
  }
}

export async function updatePaymentStatus(studentId: number, hasPaid: boolean): Promise<Student> {
  const res = await fetch(`${BASE_URL}/api/students/${studentId}/payment`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hasPaid }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to update payment status')
  }
  return res.json()
}

export async function updateCardStatus(studentId: number, cardStatus: 'active' | 'blocked'): Promise<Student> {
  const res = await fetch(`${BASE_URL}/api/students/${studentId}/card-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardStatus }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to update card status')
  }
  return res.json()
}

export async function deleteStudent(studentId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/students/${studentId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to delete student')
  }
}

// Attendance API functions
export async function getAttendance(date: string): Promise<Attendance[]> {
  const res = await fetch(`${BASE_URL}/api/attendance?date=${date}`)
  if (!res.ok) throw new Error('Failed to fetch attendance')
  return res.json()
}

export async function saveAttendance(records: { studentId: number; status: 'present' | 'absent'; date: string }[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to save attendance')
  }
}

export async function getStudentsByClass(category: string, classLevel: string): Promise<Student[]> {
  const res = await fetch(`${BASE_URL}/api/students/by-class?category=${category}&classLevel=${classLevel}`)
  if (!res.ok) throw new Error('Failed to fetch students by class')
  return res.json()
}