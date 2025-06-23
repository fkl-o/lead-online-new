import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { healthCheck } from '@/lib/api';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TestPage = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      setBackendStatus('checking');
      setError(null);
      
      const response = await healthCheck();
      
      if (response.success) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
        setError('Backend ist nicht erreichbar');
      }
    } catch (err) {
      console.error('Backend health check failed:', err);
      setBackendStatus('error');
      setError((err as Error).message || 'Verbindung zum Backend fehlgeschlagen');
    }
  };

  const getStatusIcon = () => {
    switch (backendStatus) {
      case 'connected':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'checking':
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case 'connected':
        return 'Backend ist verbunden ✅';
      case 'error':
        return 'Backend ist nicht erreichbar ❌';
      case 'checking':
      default:
        return 'Backend wird überprüft...';
    }
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected':
        return 'text-green-600 bg-green-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'checking':
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Backend Test</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Backend Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${getStatusColor()}`}>
                <p className="font-medium">{getStatusText()}</p>
                {error && (
                  <p className="text-sm mt-2">Fehler: {error}</p>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>API URL:</strong> {process.env.NODE_ENV === 'production' 
                    ? 'https://ihr-backend.onrender.com/api' 
                    : 'http://localhost:5000/api'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Environment:</strong> {process.env.NODE_ENV || 'development'}
                </p>
              </div>

              <Button 
                onClick={checkBackendStatus}
                disabled={backendStatus === 'checking'}
                className="mt-4 w-full"
              >
                {backendStatus === 'checking' ? 'Wird überprüft...' : 'Erneut prüfen'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nächste Schritte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">1. Backend starten</h3>
                  <p className="text-sm text-blue-700">
                    Stellen Sie sicher, dass das Backend läuft:
                  </p>
                  <code className="block mt-2 p-2 bg-blue-100 rounded text-sm">
                    cd backend && npm run dev
                  </code>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">2. Lead testen</h3>
                  <p className="text-sm text-green-700">
                    Wenn das Backend verbunden ist, können Sie Leads über die Formulare erstellen.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-900 mb-2">3. Dashboard aufrufen</h3>
                  <p className="text-sm text-purple-700">
                    Nach dem Login können Sie sich die erstellten Leads im Dashboard ansehen.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button asChild className="flex-1">
                  <a href="/">Zur Startseite</a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href="/dashboard">Dashboard</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
