
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Wifi, WifiOff, Activity } from 'lucide-react';

interface LiveLog {
  id: number;
  cardUID: string;
  studentName?: string;
  timestamp: string;
  access: 'allowed' | 'denied';
  reason: string;
}

const RFIDMonitor = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [liveLogs, setLiveLogs] = useState<LiveLog[]>([]);
  const [isListening, setIsListening] = useState(false);

  // Simulate real-time RFID monitoring
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening) {
      interval = setInterval(() => {
        // Simulate random card taps
        if (Math.random() > 0.7) {
          const mockCards = ['RFID001', 'RFID002', 'RFID003', 'RFID999'];
          const randomCard = mockCards[Math.floor(Math.random() * mockCards.length)];
          
          // Simulate API call to RFID log endpoint
          const newLog: LiveLog = {
            id: Date.now(),
            cardUID: randomCard,
            studentName: randomCard === 'RFID999' ? undefined : 'Student Name',
            timestamp: new Date().toISOString(),
            access: Math.random() > 0.3 ? 'allowed' : 'denied',
            reason: Math.random() > 0.5 ? 'Valid access' : 'Unpaid fees'
          };

          setLiveLogs(prev => [newLog, ...prev.slice(0, 9)]);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  const toggleMonitoring = () => {
    setIsListening(!isListening);
    setIsConnected(!isConnected);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live RFID Monitor
            </CardTitle>
            <CardDescription>Real-time monitoring of RFID card access attempts</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button
              onClick={toggleMonitoring}
              variant={isListening ? "destructive" : "default"}
              size="sm"
            >
              {isListening ? 'Stop Monitoring' : 'Start Monitoring'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {liveLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent activity</p>
            <p className="text-sm">Start monitoring to see live RFID taps</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700">Recent Activity</h4>
            {liveLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    log.access === 'allowed' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">
                      {log.studentName || 'Unknown Card'}
                    </p>
                    <p className="text-xs text-gray-500">Card: {log.cardUID}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={log.access === 'allowed' ? "default" : "destructive"}>
                    {log.access}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RFIDMonitor;
