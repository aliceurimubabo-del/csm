
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Calendar, FileText } from 'lucide-react';

interface Log {
  id: number;
  studentName: string;
  cardUID: string;
  timestamp: string;
  status: 'allowed' | 'denied';
  reason: string;
  location?: string;
}

const RFIDLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'allowed' | 'denied'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;

  // Mock data - replace with actual API calls
  const allLogs: Log[] = [
    { id: 1, studentName: 'John Doe', cardUID: 'RFID001', timestamp: '2024-01-15 09:15:23', status: 'allowed', reason: 'Valid access', location: 'Main Gate' },
    { id: 2, studentName: 'Jane Smith', cardUID: 'RFID002', timestamp: '2024-01-15 09:12:45', status: 'denied', reason: 'Unpaid fees', location: 'Library Entrance' },
    { id: 3, studentName: 'Mike Johnson', cardUID: 'RFID003', timestamp: '2024-01-15 09:08:12', status: 'allowed', reason: 'Valid access', location: 'Cafeteria' },
    { id: 4, studentName: 'Sarah Wilson', cardUID: 'RFID004', timestamp: '2024-01-15 09:05:34', status: 'allowed', reason: 'Valid access', location: 'Main Gate' },
    { id: 5, studentName: 'Tom Brown', cardUID: 'RFID005', timestamp: '2024-01-15 09:02:56', status: 'denied', reason: 'Card blocked', location: 'Dormitory A' },
    { id: 6, studentName: 'Alice Johnson', cardUID: 'RFID006', timestamp: '2024-01-15 08:58:17', status: 'allowed', reason: 'Valid access', location: 'Lab Building' },
    { id: 7, studentName: 'Bob Davis', cardUID: 'RFID007', timestamp: '2024-01-15 08:55:43', status: 'denied', reason: 'Outside allowed hours', location: 'Gym' },
    { id: 8, studentName: 'Carol White', cardUID: 'RFID008', timestamp: '2024-01-15 08:52:18', status: 'allowed', reason: 'Valid access', location: 'Main Gate' },
  ];

  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.cardUID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const startIndex = (currentPage - 1) * logsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const getStatusBadge = (status: string) => {
    return status === 'allowed' 
      ? <Badge variant="default" className="bg-green-100 text-green-800">Allowed</Badge>
      : <Badge variant="destructive">Denied</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">RFID Access Logs</h2>
        <p className="text-gray-600">Monitor all RFID card access attempts in real-time</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Access Attempts</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allLogs.length}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Access</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allLogs.filter(log => log.status === 'allowed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((allLogs.filter(log => log.status === 'allowed').length / allLogs.length) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denied Access</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {allLogs.filter(log => log.status === 'denied').length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter Logs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name or card UID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
              >
                All Status
              </Button>
              <Button
                variant={statusFilter === 'allowed' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('allowed')}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                Allowed
              </Button>
              <Button
                variant={statusFilter === 'denied' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('denied')}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Denied
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Access Log Entries</CardTitle>
          <CardDescription>
            Showing {paginatedLogs.length} of {filteredLogs.length} log entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Student</th>
                  <th className="text-left p-4 font-medium">Card UID</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Time</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Reason</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => {
                  const { date, time } = formatDate(log.timestamp);
                  return (
                    <tr key={log.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {log.studentName.charAt(0)}
                          </div>
                          <span className="font-medium">{log.studentName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">{log.cardUID}</code>
                      </td>
                      <td className="p-4 text-sm">{date}</td>
                      <td className="p-4 text-sm font-mono">{time}</td>
                      <td className="p-4 text-sm">{log.location}</td>
                      <td className="p-4">{getStatusBadge(log.status)}</td>
                      <td className="p-4 text-sm text-gray-600">{log.reason}</td>
                    </tr>
                  );
                })}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RFIDLogs;
