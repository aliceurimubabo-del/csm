import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import { ArrowLeft, Search, Check, X, Save } from 'lucide-react';
import { getStudentsByClass, getAttendance, saveAttendance, type Student, type Attendance } from '../api/students';

const AttendancePage = () => {
  const { category, classLevel } = useParams<{ category: string; classLevel: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, 'present' | 'absent'>>({});

  // Fetch students in this class
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['students-by-class', category, classLevel],
    queryFn: () => getStudentsByClass(category!, classLevel!),
    enabled: !!category && !!classLevel,
  });

  // Fetch attendance for selected date
  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: () => getAttendance(selectedDate),
  });

  // Initialize attendance map from fetched records
  React.useEffect(() => {
    const map: Record<number, 'present' | 'absent'> = {};
    attendanceRecords.forEach((record: Attendance) => {
      map[record.studentId] = record.status;
    });
    setAttendanceMap(map);
  }, [attendanceRecords]);

  // Save attendance mutation
  const saveMutation = useMutation({
    mutationFn: saveAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Attendance Saved',
        description: 'Attendance records have been saved successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to save attendance.',
        variant: 'destructive',
      });
    },
  });

  const toggleAttendance = (studentId: number) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleSave = () => {
    const records = students.map((student) => ({
      studentId: student.id,
      status: attendanceMap[student.id] || 'absent',
      date: selectedDate,
    }));
    saveMutation.mutate(records);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = Object.values(attendanceMap).filter((status) => status === 'present').length;
  const totalCount = students.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate(`/dashboard/categories/${category}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {category?.toUpperCase()} - {classLevel}
            </h2>
            <p className="text-gray-600">Mark attendance for students</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {saveMutation.isPending ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>

      {/* Date and Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="text-center px-6 py-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{presentCount} / {totalCount}</p>
                <p className="text-sm text-gray-600">Present</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {studentsLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No students found in this class</p>
          ) : (
            <div className="space-y-2">
              {filteredStudents.map((student) => {
                const status = attendanceMap[student.id];
                const isPresent = status === 'present';
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {student.photoURL ? (
                        <img
                          src={student.photoURL}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {student.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">ID: {student.id}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={isPresent ? 'default' : 'outline'}
                        onClick={() => toggleAttendance(student.id)}
                        className={isPresent ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={!isPresent && status === 'absent' ? 'default' : 'outline'}
                        onClick={() => toggleAttendance(student.id)}
                        className={!isPresent && status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;