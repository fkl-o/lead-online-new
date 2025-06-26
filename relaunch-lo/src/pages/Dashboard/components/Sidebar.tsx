import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  MessageSquare, 
  FileText, 
  Settings, 
  Bell,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  Shield,
  Database,
  Workflow,
  ChevronLeft,
  ChevronRight,
  Home,
  ExternalLink,
  X
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
  onCollapseChange?: (collapsed: boolean) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
}

// Menü für Kunden - nur das Wesentliche
const customerMenuItems: MenuSection[] = [
  {
    section: 'Mein Bereich',
    items: [
      { id: 'customer-requests', label: 'Meine Anfragen', icon: MessageSquare, badge: 'active' },
    ]
  }
];

// Vollständiges Menü für Admin und Vertrieb
const fullMenuItems: MenuSection[] = [
  {
    section: 'Dashboard',
    items: [
      { id: 'overview', label: 'Übersicht', icon: Home },
      { id: 'leads', label: 'Lead-Management', icon: Target, badge: 'active' },
      { id: 'users', label: 'Benutzer', icon: Users, badge: null, adminOnly: true },
    ]
  },
  {
    section: 'In Entwicklung',
    items: [
      { id: 'companies', label: 'Unternehmen', icon: Building2, badge: null, disabled: true },
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

const Sidebar = ({ currentView, onViewChange, user, className, onCollapseChange, isMobileMenuOpen, onMobileMenuClose }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'kunde';

  // Wähle das passende Menü basierend auf der Benutzerrolle
  const menuItems = isCustomer ? customerMenuItems : fullMenuItems;

  const handleBackToWebsite = () => {
    navigate('/');
  };

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId);
    // Close mobile menu when item is selected
    if (onMobileMenuClose) {
      onMobileMenuClose();
    }
  };

  const filteredMenuItems = menuItems.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOnly || isAdmin)
  })).filter(section => section.items.length > 0);
  
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black z-40 lg:hidden transition-opacity duration-300",
          isMobileMenuOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileMenuClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col shadow-lg h-screen z-50",
        // Desktop positioning and transitions
        "lg:fixed lg:left-0 lg:top-0 lg:transition-all lg:duration-300",
        collapsed ? "lg:w-16" : "lg:w-64",
        // Mobile positioning with smooth slide animation
        "fixed left-0 top-0 w-64 transition-transform duration-300 ease-out lg:transform-none",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-brand-600 to-secondary-600 p-2 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">LeadGen Pro</h2>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
          )}
          
          {/* Desktop Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newCollapsed = !collapsed;
              setCollapsed(newCollapsed);
              onCollapseChange?.(newCollapsed);
            }}
            className="h-8 w-8 p-0 hidden lg:flex"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          
          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuClose}
            className="h-8 w-8 p-0 lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {filteredMenuItems.map((section) => (
            <div key={section.section} className="p-2">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  {section.section}
                </h3>
              )}
              <nav className="space-y-1">
                {section.items.map((item) => {
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
                      onClick={() => !isDisabled && handleItemClick(item.id)}
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

        {/* Footer with Action Buttons */}
        <div className={cn(
          "sticky bottom-0 bg-white border-t border-gray-200",
          collapsed ? "p-2" : "p-4"
        )}>
          {/* Back to Website Button */}
          <Button
            variant="outline"
            className={cn(
              "w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
              collapsed ? "justify-center px-0" : "justify-start"
            )}
            onClick={handleBackToWebsite}
            title={collapsed ? "Zurück zur Website" : undefined}
          >
            <ExternalLink className={cn(
              "h-4 w-4 shrink-0",
              collapsed ? "" : "mr-3"
            )} />
            {!collapsed && <span>Zurück zur Website</span>}
          </Button>

          {/* Version Info (only when not collapsed) */}
          {!collapsed && (
            <div className="text-xs text-gray-500 text-center pt-3">
              <p>Version 2.0.0</p>
              <p>© 2024 LeadGen Pro</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
