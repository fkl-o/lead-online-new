import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  user: any;
  currentView: string;
  onLogout: () => void;
  className?: string;
}

const viewTitles: Record<string, { title: string; subtitle: string }> = {
  overview: { title: 'Dashboard Übersicht', subtitle: 'Willkommen zurück! Hier ist Ihre Zusammenfassung.' },
  leads: { title: 'Lead Management', subtitle: 'Verwalten und verfolgen Sie alle Ihre Leads.' },
  users: { title: 'Benutzerverwaltung', subtitle: 'Verwalten Sie Benutzer und deren Zugriffsrechte.' },
};

const TopBar = ({ user, currentView, onLogout, className }: TopBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentViewInfo = viewTitles[currentView] || { title: 'Feature in Entwicklung', subtitle: 'Diese Funktion wird derzeit entwickelt.' };

  return (
    <div className={cn(
      "bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40",
      className
    )}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title and search */}
          <div className="flex items-center space-x-6 flex-1">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentViewInfo.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {currentViewInfo.subtitle}
              </p>
            </div>

            {/* Global Search - nur für aktive Seiten */}
            {(currentView === 'leads' || currentView === 'users') && (
              <div className="hidden md:block relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={currentView === 'leads' ? "Leads suchen..." : "Benutzer suchen..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-80 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* Right side - User menu only */}
          <div className="flex items-center space-x-3">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 px-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1">
                      <span className="text-white font-medium text-sm w-6 h-6 flex items-center justify-center">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <Badge 
                      variant={user?.role === 'admin' ? 'default' : 'secondary'}
                      className="text-xs mt-1"
                    >
                      {user?.role === 'admin' ? 'Administrator' : 'Benutzer'}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Abmelden</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
