
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Settings, Wifi, AlertCircle } from 'lucide-react';

const RFIDSettings = () => {
  const [readerIP, setReaderIP] = useState('192.168.1.100');
  const [readerPort, setReaderPort] = useState('8080');
  const [isAutoAccept, setIsAutoAccept] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');

  const testConnection = async () => {
    setConnectionStatus('testing');
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectionStatus(Math.random() > 0.5 ? 'connected' : 'disconnected');
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return <Badge variant="destructive">Disconnected</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          RFID Hardware Settings
        </CardTitle>
        <CardDescription>Configure RFID reader connection and access policies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Settings */}
        <div className="space-y-4">
          <h4 className="font-medium">Hardware Connection</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Reader IP Address</label>
              <Input
                value={readerIP}
                onChange={(e) => setReaderIP(e.target.value)}
                placeholder="192.168.1.100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Port</label>
              <Input
                value={readerPort}
                onChange={(e) => setReaderPort(e.target.value)}
                placeholder="8080"
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span className="text-sm">Connection Status:</span>
              {getStatusBadge()}
            </div>
            <Button onClick={testConnection} variant="outline" size="sm">
              Test Connection
            </Button>
          </div>
        </div>

        {/* Access Control Settings */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Access Control Policies</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-accept valid cards</p>
              <p className="text-xs text-gray-500">Automatically grant access to paid students with active cards</p>
            </div>
            <Switch
              checked={isAutoAccept}
              onCheckedChange={setIsAutoAccept}
            />
          </div>
        </div>

        {/* API Configuration */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">API Configuration</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Hardware Integration Endpoint:</p>
            <code className="text-xs bg-white p-2 rounded border block">
              POST /api/rfid-log
              <br />
              Body: {JSON.stringify({ cardUID: "CARD_UID_HERE" }, null, 2)}
            </code>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4 pt-4 border-t border-red-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <h4 className="font-medium text-red-600">Danger Zone</h4>
          </div>
          <Button variant="destructive" size="sm">
            Reset All RFID Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RFIDSettings;
