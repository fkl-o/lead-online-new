import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authApi } from '@/lib/api';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await authApi.getMe();
        if (response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear storage
          authApi.logout();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authApi.logout();
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (isAuthenticated === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole && user && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-lg">🔒</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Zugriff verweigert</h3>
          <p className="text-gray-600">
            Sie haben keine Berechtigung, diese Seite zu sehen. 
            {requiredRole && ` Erforderliche Rolle: ${requiredRole}`}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Zurück
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
