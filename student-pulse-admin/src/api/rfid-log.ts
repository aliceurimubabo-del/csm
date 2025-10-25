
interface RFIDLogRequest {
  cardUID: string;
}

interface RFIDLogResponse {
  success: boolean;
  access: 'allowed' | 'denied';
  reason: string;
  studentName?: string;
  logId?: number;
}

// Mock API endpoint - replace with actual API implementation when you have backend
export const handleRFIDLog = async (cardUID: string): Promise<RFIDLogResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock student database lookup
  const mockStudents = [
    { id: 1, name: 'John Doe', cardUID: 'RFID001', hasPaid: true, cardStatus: 'active' },
    { id: 2, name: 'Jane Smith', cardUID: 'RFID002', hasPaid: false, cardStatus: 'active' },
    { id: 3, name: 'Mike Johnson', cardUID: 'RFID003', hasPaid: true, cardStatus: 'blocked' },
  ];

  const student = mockStudents.find(s => s.cardUID === cardUID);

  if (!student) {
    return {
      success: true,
      access: 'denied',
      reason: 'Card not found in system'
    };
  }

  if (student.cardStatus === 'blocked') {
    return {
      success: true,
      access: 'denied',
      reason: 'Card blocked',
      studentName: student.name
    };
  }

  if (!student.hasPaid) {
    return {
      success: true,
      access: 'denied',
      reason: 'Unpaid fees',
      studentName: student.name
    };
  }

  return {
    success: true,
    access: 'allowed',
    reason: 'Valid access',
    studentName: student.name,
    logId: Math.floor(Math.random() * 10000)
  };
};
