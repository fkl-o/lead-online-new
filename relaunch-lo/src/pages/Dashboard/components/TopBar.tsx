import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  LogOut,
  Users,
  Building2,
  Target,
  Home
} from 'lucide-react';

interface TopBarProps {
  user: any;
  currentView: string;
  onLogout: () => void;
  onOpenAccountModal: () => void;
}

const getViewTitle = (view: string) => {
  const titles: Record<string, { title: string; icon: any }> = {
    overview: { title: 'Dashboard Übersicht', icon: Home },
    leads: { title: 'Lead-Management', icon: Target },
    companies: { title: 'Unternehmens-Verwaltung', icon: Building2 },
    users: { title: 'Benutzer-Verwaltung', icon: Users },
    pipeline: { title: 'Sales Pipeline', icon: Target },
    activities: { title: 'Aktivitäten', icon: Target },
    calendar: { title: 'Kalender', icon: Target },
    communications: { title: 'Kommunikation', icon: Target },
    documents: { title: 'Dokumente', icon: Target },
    workflows: { title: 'Workflows', icon: Target },
    data: { title: 'Datenmanagement', icon: Target },
    security: { title: 'Sicherheit', icon: Target },
    notifications: { title: 'Benachrichtigungen', icon: Target },
    settings: { title: 'Einstellungen', icon: Target },
  };
  return titles[view] || { title: 'Dashboard', icon: Home };
};

const TopBar = ({ user, currentView, onLogout, onOpenAccountModal }: TopBarProps) => {
  const navigate = useNavigate();
  const { title, icon: ViewIcon } = getViewTitle(currentView);

  const handleLogout = () => {
    onLogout();
    // Direkt zur Startseite navigieren
    navigate('/');
  };

  const getUserInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'vertrieb':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'kunde':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'lead':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      {/* Left Side - Page Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-r from-brand-600 to-secondary-600 p-2 rounded-lg">
          <ViewIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">
            Willkommen zurück, {user?.name}
          </p>
        </div>
      </div>

      {/* Right Side - User Actions */}
      <div className="flex items-center space-x-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-900">
                {user?.name}
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getRoleBadgeColor(user?.role)}`}
              >
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Badge>
            </div>
            <div className="text-xs text-gray-500">
              {user?.email}
            </div>
          </div>
          
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-r from-brand-600 to-secondary-600 text-white font-semibold">
              {getUserInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* User Settings Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onOpenAccountModal}
            className="h-10 w-10 rounded-full border-gray-300 hover:bg-gray-50"
            title="Benutzer-Einstellungen"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="h-10 w-10 rounded-full border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            title="Abmelden"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
