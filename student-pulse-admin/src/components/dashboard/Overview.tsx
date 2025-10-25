
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users, CreditCard, Activity, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import RFIDMonitor from './RFIDMonitor';

const Overview = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalStudents: 1247,
    paidStudents: 1089,
    unpaidStudents: 158,
    activeCards: 1156,
    blockedCards: 91,
    todayAccess: 892,
    deniedAccess: 23
  };

  const recentLogs = [
    { id: 1, studentName: 'John Doe', timestamp: '2024-01-15 09:15:23', status: 'allowed' },
    { id: 2, studentName: 'Jane Smith', timestamp: '2024-01-15 09:12:45', status: 'denied' },
    { id: 3, studentName: 'Mike Johnson', timestamp: '2024-01-15 09:08:12', status: 'allowed' },
    { id: 4, studentName: 'Sarah Wilson', timestamp: '2024-01-15 09:05:34', status: 'allowed' },
    { id: 5, studentName: 'Tom Brown', timestamp: '2024-01-15 09:02:56', status: 'denied' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Real-time insights into your campus access control system</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Registered in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Students</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paidStudents}</div>
            <p className="text-xs text-muted-foreground">
              {((stats.paidStudents / stats.totalStudents) * 100).toFixed(1)}% payment rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cards</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCards}</div>
            <p className="text-xs text-muted-foreground">{stats.blockedCards} blocked cards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Access</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAccess}</div>
            <p className="text-xs text-muted-foreground">{stats.deniedAccess} denied attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Live RFID Monitor and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live RFID Monitor */}
        <RFIDMonitor />

        {/* Recent Access Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Access Logs
            </CardTitle>
            <CardDescription>Latest RFID card access attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{log.studentName}</p>
                    <p className="text-xs text-gray-500">{log.timestamp}</p>
                  </div>
                  <Badge variant={log.status === 'allowed' ? "default" : "destructive"}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Add New Student</h3>
              <p className="text-sm text-gray-600">Register a new student and issue RFID card</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
              <h3 className="font-medium">Block Card</h3>
              <p className="text-sm text-gray-600">Quickly block a lost or stolen card</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Activity className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">View Logs</h3>
              <p className="text-sm text-gray-600">Analyze access patterns and security</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
