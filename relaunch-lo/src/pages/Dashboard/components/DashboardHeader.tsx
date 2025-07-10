import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              lead.online Dashboard
            </h1>
            {user && <p className="text-gray-600 text-sm">Willkommen zurück, {user.name}!</p>}
          </div>
        </div>
        <Button variant="outline" onClick={onLogout} className="border-gray-200 hover:bg-gray-50">
          Ausloggen
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
