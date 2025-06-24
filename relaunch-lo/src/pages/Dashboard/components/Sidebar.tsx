import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  Building2, 
  MessageSquare, 
  FileText, 
  Settings, 
  Bell, 
  PieChart,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Shield,
  Database,
  Workflow,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string | null;
  adminOnly?: boolean;
  disabled?: boolean;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: any;
  className?: string;
}

const menuItems: MenuSection[] = [
  {
    section: 'Dashboard',
    items: [
      { id: 'overview', label: 'Übersicht', icon: Home },
      { id: 'leads', label: 'Leads', icon: Target, badge: 'active' },
      { id: 'companies', label: 'Unternehmen', icon: Building2 },
    ]
  },
  {
    section: 'Benutzerverwaltung',
    items: [
      { id: 'users', label: 'Benutzer', icon: Users, badge: null, adminOnly: true },
    ]
  },
  {    section: 'In Entwicklung',
    items: [
      { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null, disabled: true },
      { id: 'reports', label: 'Berichte', icon: PieChart, badge: null, disabled: true },
      { id: 'pipeline', label: 'Pipeline', icon: TrendingUp, badge: null, disabled: true },
      { id: 'activities', label: 'Aktivitäten', icon: Activity, badge: null, disabled: true },
      { id: 'calendar', label: 'Kalender', icon: Calendar, badge: null, disabled: true },
      { id: 'communications', label: 'Kommunikation', icon: MessageSquare, badge: null, disabled: true },
      { id: 'documents', label: 'Dokumente', icon: FileText, badge: null, disabled: true },
      { id: 'workflows', label: 'Workflows', icon: Workflow, badge: null, disabled: true, adminOnly: true },
      { id: 'data', label: 'Datenmanagement', icon: Database, badge: null, disabled: true, adminOnly: true },
      { id: 'security', label: 'Sicherheit', icon: Shield, badge: null, disabled: true, adminOnly: true },
      { id: 'notifications', label: 'Benachrichtigungen', icon: Bell, badge: null, disabled: true },
      { id: 'settings', label: 'Einstellungen', icon: Settings, badge: null, disabled: true },
    ]
  }
];

const Sidebar = ({ currentView, onViewChange, user, className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = user?.role === 'admin';

  const filteredMenuItems = menuItems.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOnly || isAdmin)
  })).filter(section => section.items.length > 0);

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-brand-600 to-secondary-600 p-2 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">LeadGen Pro</h2>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user?.name}</p>
              <div className="flex items-center space-x-1">
                <Badge 
                  variant={user?.role === 'admin' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {user?.role === 'admin' ? 'Administrator' : 'Benutzer'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {filteredMenuItems.map((section) => (
          <div key={section.section} className="p-2">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                {section.section}
              </h3>
            )}
            <nav className="space-y-1">              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                const isDisabled = item.disabled;
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    disabled={isDisabled}
                    className={cn(
                      "w-full justify-start group relative",
                      collapsed ? "px-3" : "px-3",
                      isActive && !isDisabled
                        ? "bg-brand-50 text-brand-700 border-r-2 border-brand-600" 
                        : isDisabled
                        ? "text-gray-400 cursor-not-allowed opacity-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                    onClick={() => !isDisabled && onViewChange(item.id)}
                  >
                    <Icon className={cn(
                      "h-4 w-4 shrink-0",
                      collapsed ? "mx-auto" : "mr-3"
                    )} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{item.label}</span>
                        {item.badge && !isDisabled && (
                          <Badge 
                            variant={item.badge === 'active' ? 'default' : 'secondary'}
                            className="ml-auto text-xs"
                          >
                            {item.badge === 'active' ? '●' : item.badge}
                          </Badge>
                        )}
                        {isDisabled && (
                          <Badge 
                            variant="outline"
                            className="ml-auto text-xs text-gray-400"
                          >
                            Bald
                          </Badge>
                        )}
                      </>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                        {item.label}
                        {isDisabled && " (In Entwicklung)"}
                        {item.badge && item.badge !== 'active' && !isDisabled && (
                          <span className="ml-1">({item.badge})</span>
                        )}
                      </div>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed ? (
          <div className="text-xs text-gray-500 text-center">
            <p>Version 2.0.0</p>
            <p>© 2024 LeadGen Pro</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
