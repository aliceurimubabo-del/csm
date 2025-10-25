
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useToast } from '../ui/use-toast';
import { Search, User, Plus, Trash2, Edit, Info, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { getStudents, getStudentById, updatePaymentStatus, updateCardStatus, createStudent, deleteStudent } from '../../api/students';
import AddStudentForm from '../forms/AddStudentForm';
import ConfirmationDialog from '../ui/confirmation-dialog';

interface Student {
  id: number;
  name: string;
  cardUID: string;
  hasPaid: boolean;
  cardStatus: 'active' | 'blocked';
  email: string;
  photoURL?: string;
  category?: string;
  classLevel?: string;
  program?: string;
  age?: number;
  lastAccess?: string;
}

const StudentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; studentId?: number; studentName?: string }>({
    open: false
  });
  const [detailsDialog, setDetailsDialog] = useState<{ open: boolean; student?: Student }>({
    open: false
  });
  
  const studentsPerPage = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch students
  const { data: allStudents = [], isLoading, error } = useQuery({
    queryKey: ['students', 1], // institutionId = 1 for mock
    queryFn: () => getStudents(1),
  });

  // Payment status mutation
  const paymentMutation = useMutation({
    mutationFn: ({ studentId, hasPaid }: { studentId: number; hasPaid: boolean }) =>
      updatePaymentStatus(studentId, hasPaid),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Payment Status Updated',
        description: `${updatedStudent.name} marked as ${updatedStudent.hasPaid ? 'paid' : 'unpaid'}.`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update payment status.',
        variant: 'destructive',
      });
    },
  });

  // Card status mutation
  const cardStatusMutation = useMutation({
    mutationFn: ({ studentId, cardStatus }: { studentId: number; cardStatus: 'active' | 'blocked' }) =>
      updateCardStatus(studentId, cardStatus),
    onSuccess: (updatedStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: 'Card Status Updated',
        description: `${updatedStudent.name}'s card ${updatedStudent.cardStatus === 'active' ? 'activated' : 'blocked'}.`,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update card status.',
        variant: 'destructive',
      });
    },
  });

  // Create student mutation
  const createMutation = useMutation({
    mutationFn: (studentData: { name: string; email: string; cardUID: string }) =>
      createStudent(studentData, 1),
    onSuccess: (newStudent) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setShowAddForm(false);
      toast({
        title: 'Student Added',
        description: `${newStudent.name} has been added successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add student.',
        variant: 'destructive',
      });
    },
  });

  // Delete student mutation
  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setDeleteDialog({ open: false });
      toast({
        title: 'Student Deleted',
        description: 'Student has been removed from the system.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete student.',
        variant: 'destructive',
      });
    },
  });

  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'paid' && student.hasPaid) ||
                         (filterStatus === 'unpaid' && !student.hasPaid);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + studentsPerPage);

  const togglePaymentStatus = (studentId: number, currentStatus: boolean) => {
    console.log('Toggle payment for student ID:', studentId, 'Current status:', currentStatus)
    paymentMutation.mutate({ studentId, hasPaid: !currentStatus });
  };

  const toggleCardStatus = (studentId: number, currentStatus: 'active' | 'blocked') => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    cardStatusMutation.mutate({ studentId, cardStatus: newStatus });
  };

  const handleDeleteStudent = (studentId: number, studentName: string) => {
    setDeleteDialog({ open: true, studentId, studentName });
  };

  const handleShowDetails = (student: Student) => {
    setDetailsDialog({ open: true, student });
  };

  const confirmDelete = () => {
    if (deleteDialog.studentId) {
      deleteMutation.mutate(deleteDialog.studentId);
    }
  };

  if (showAddForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Add New Student</h2>
            <p className="text-gray-600">Create a new student record with RFID card</p>
          </div>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Back to List
          </Button>
        </div>
        <AddStudentForm
          onSubmit={(data) => createMutation.mutate(data)}
          onCancel={() => setShowAddForm(false)}
          isLoading={createMutation.isPending}
        />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-600">Error loading students: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Students Management</h2>
          <p className="text-gray-600">Manage student records and RFID card access</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All Students
              </Button>
              <Button
                variant={filterStatus === 'paid' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('paid')}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                Paid
              </Button>
              <Button
                variant={filterStatus === 'unpaid' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('unpaid')}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Unpaid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `Showing ${paginatedStudents.length} of ${filteredStudents.length} students`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Student</th>
                      <th className="text-left p-4 font-medium">Card UID</th>
                      <th className="text-left p-4 font-medium">Payment Status</th>
                      <th className="text-left p-4 font-medium">Card Status</th>
                      <th className="text-left p-4 font-medium">Last Access</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            {student.photoURL ? (
                              <img 
                                src={student.photoURL} 
                                alt={student.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                {student.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{student.cardUID}</code>
                        </td>
                        <td className="p-4">
                          <Badge variant={student.hasPaid ? "default" : "destructive"}>
                            {student.hasPaid ? 'Paid' : 'Unpaid'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={student.cardStatus === 'active' ? "default" : "secondary"}
                            className={student.cardStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {student.cardStatus}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {student.lastAccess || 'Never'}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShowDetails(student)}
                              className="text-purple-600 border-purple-600 hover:bg-purple-50"
                              title="View Details"
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteStudent(student.id, student.name)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={confirmDelete}
        title="Delete Student"
        description={`Are you sure you want to delete ${deleteDialog.studentName}? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />

      {/* Student Details Dialog */}
      <Dialog open={detailsDialog.open} onOpenChange={(open) => setDetailsDialog({ open, student: open ? detailsDialog.student : undefined })}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl max-h-[95vh] sm:max-h-[90vh] w-full flex flex-col p-0 overflow-hidden">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 py-3 sm:py-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Student Details
              </DialogTitle>
              <DialogDescription>
                Complete information about the student
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Scrollable Content */}
          {detailsDialog.student && (
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
              <div className="space-y-4 sm:space-y-6 pb-4">
              {/* Student Photo and Basic Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm">
                {detailsDialog.student.photoURL ? (
                  <img
                    src={detailsDialog.student.photoURL}
                    alt={detailsDialog.student.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                    {detailsDialog.student.name.charAt(0)}
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{detailsDialog.student.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 break-all">{detailsDialog.student.email}</p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    <Badge variant={detailsDialog.student.hasPaid ? "default" : "destructive"}>
                      {detailsDialog.student.hasPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                    <Badge 
                      variant={detailsDialog.student.cardStatus === 'active' ? "default" : "secondary"}
                      className={detailsDialog.student.cardStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    >
                      {detailsDialog.student.cardStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="space-y-3 sm:space-y-4 bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📋</span>
                  <span>Basic Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 border rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Student ID</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">{detailsDialog.student.id}</p>
                  </div>
                  {detailsDialog.student.age && (
                    <div className="p-3 sm:p-4 border rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Age</p>
                      <p className="font-semibold text-sm sm:text-base text-gray-900">{detailsDialog.student.age} years</p>
                    </div>
                  )}
                  <div className="p-3 sm:p-4 border rounded-lg col-span-1 sm:col-span-2">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Card UID</p>
                    <code className="font-semibold text-sm sm:text-base text-gray-900 bg-gray-100 px-2 py-1 rounded break-all">
                      {detailsDialog.student.cardUID}
                    </code>
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              {(detailsDialog.student.category || detailsDialog.student.classLevel || detailsDialog.student.program) && (
                <div className="space-y-3 sm:space-y-4 bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">🎓</span>
                    <span>Academic Information</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {detailsDialog.student.category && (
                      <div className="p-3 sm:p-4 border rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Category</p>
                        <p className="font-semibold text-sm sm:text-base text-gray-900">{detailsDialog.student.category}</p>
                      </div>
                    )}
                    {detailsDialog.student.classLevel && (
                      <div className="p-3 sm:p-4 border rounded-lg">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Class Level</p>
                        <p className="font-semibold text-sm sm:text-base text-gray-900">{detailsDialog.student.classLevel}</p>
                      </div>
                    )}
                    {detailsDialog.student.program && (
                      <div className="p-3 sm:p-4 border rounded-lg col-span-1 sm:col-span-2">
                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Program</p>
                        <p className="font-semibold text-sm sm:text-base text-gray-900">{detailsDialog.student.program}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Financial Information Section */}
              <div className="space-y-3 sm:space-y-4 bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">💰</span>
                  <span>Financial Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className={`p-3 sm:p-4 border-2 rounded-lg ${
                    detailsDialog.student.hasPaid 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Payment Status</p>
                    <p className={`font-bold text-base sm:text-lg ${
                      detailsDialog.student.hasPaid ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {detailsDialog.student.hasPaid ? '✅ Paid' : '❌ Unpaid'}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 border rounded-lg bg-gray-50">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Last Access</p>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">
                      {detailsDialog.student.lastAccess || 'Never'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Status Section */}
              <div className="space-y-3 sm:space-y-4 bg-white rounded-lg border p-3 sm:p-4 shadow-sm">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🔐</span>
                  <span>Card Status</span>
                </h4>
                <div className={`p-3 sm:p-4 border-2 rounded-lg ${
                  detailsDialog.student.cardStatus === 'active'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Current Status</p>
                  <p className={`font-bold text-base sm:text-lg ${
                    detailsDialog.student.cardStatus === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {detailsDialog.student.cardStatus === 'active' ? '🟢 Active' : '🔴 Blocked'}
                  </p>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Fixed Footer with Action Buttons */}
          {detailsDialog.student && (
            <div className="sticky bottom-0 z-10 bg-white border-t px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
                <div className="flex flex-col sm:flex-row gap-2 flex-1">
                  <Button
                    variant="outline"
                    onClick={() => {
                      togglePaymentStatus(detailsDialog.student.id, detailsDialog.student.hasPaid);
                      setDetailsDialog({ open: false });
                    }}
                    disabled={paymentMutation.isPending}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 flex-1"
                  >
                    {detailsDialog.student.hasPaid ? 'Mark Unpaid' : 'Mark Paid'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      toggleCardStatus(detailsDialog.student.id, detailsDialog.student.cardStatus);
                      setDetailsDialog({ open: false });
                    }}
                    disabled={cardStatusMutation.isPending}
                    className={`flex-1 ${
                      detailsDialog.student.cardStatus === 'active'
                        ? 'text-red-600 border-red-600 hover:bg-red-50'
                        : 'text-green-600 border-green-600 hover:bg-green-50'
                    }`}
                  >
                    {detailsDialog.student.cardStatus === 'active' ? 'Block Card' : 'Activate Card'}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setDetailsDialog({ open: false })}
                  className="sm:w-auto w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsManagement;
