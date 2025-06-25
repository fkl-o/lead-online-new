import { useState, useEffect, Suspense, lazy } from 'react';
import { leadApi, authApi } from '@/lib/api';
import { useSnackbar } from '@/components/ui/snackbar';

// Core components - always loaded
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { LoadingState, ErrorState } from './components/LoadingAndErrorStates';

// Lazy load heavy dashboard components
const Overview = lazy(() => import('./components/Overview'));
const StatsCards = lazy(() => import('./components/StatsCards'));
const LeadsTable = lazy(() => import('./components/LeadsTable'));
const LeadEditModal = lazy(() => import('./components/LeadEditModal'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const CompanyManagement = lazy(() => import('./components/CompanyManagement'));
const AccountModal = lazy(() => import('./components/AccountModal'));

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Company {
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
  phone?: string;
  address?: string;
}

interface Comment {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  type: 'email' | 'phone' | 'meeting' | 'proposal' | 'follow-up';
  subject?: string;
  content: string;
  date: string;
  direction?: 'inbound' | 'outbound';
}

interface Attachment {
  _id: string;
  filename: string;
  originalName?: string;
  url: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt: string;
  uploadedBy?: {
    _id: string;
    name: string;
  };
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  salutation?: 'herr' | 'frau';
  phone?: string;
  source: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  value?: number;
  company?: Company;
  communications?: Comment[];
  attachments?: Attachment[];
}

interface Stats {
  totalLeads: number;
  statusStats?: Array<{ _id: string; count: number }>;
  conversionStats?: {
    conversionRate: number;
    totalValue: number;
  };
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  priority: string;
  leadId?: string;
  user?: {
    _id: string;
    name: string;
  };
}

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [currentView, setCurrentView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Authentication is already verified by ProtectedRoute
    // Just get user from localStorage and load data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load leads, stats and activities in parallel
      const [leadsResponse, statsResponse, activitiesResponse] = await Promise.all([
        leadApi.getLeads(),
        leadApi.getLeadStats(),
        leadApi.getRecentActivities(10)
      ]);

      if (leadsResponse.success) {
        setLeads(leadsResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (activitiesResponse.success) {
        setActivities(activitiesResponse.data || []);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Fehler beim Laden der Dashboard-Daten');
    } finally {
      setLoading(false);
    }
  };  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    try {
      const response = await leadApi.updateLeadStatus(leadId, newStatus);
      if (response.success) {
        // Reload data after successful update
        loadDashboardData();
      }
    } catch (err) {
      console.error('Error updating lead status:', err);
      showSnackbar('Fehler beim Aktualisieren des Lead-Status', 'error');
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setEditForm({
      ...lead,
      company: { ...lead.company }
    });
    setIsEditModalOpen(true);
  };
  const handleSaveLead = async () => {
    if (!selectedLead || !editForm) return;
    
    try {
      // Extract only the fields that should be updated, excluding communications and attachments
      const { communications, attachments, ...leadUpdateData } = editForm;
      
      const response = await leadApi.updateLead(selectedLead._id, leadUpdateData);
      if (response.success) {
        setIsEditModalOpen(false);
        setSelectedLead(null);
        setEditForm({});
        loadDashboardData();
        showSnackbar('Lead erfolgreich aktualisiert!', 'success');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      showSnackbar('Fehler beim Speichern des Leads', 'error');
    }
  };const handleAddComment = async (commentText: string) => {
    if (!selectedLead || !commentText.trim()) return;
    
    try {
      const response = await leadApi.addComment(selectedLead._id, { text: commentText });
      if (response.success && response.data) {
        // Update the editForm with the updated lead data (including new communication)
        setEditForm(prev => ({
          ...prev,
          communications: response.data.communications || []
        }));
        
        // Also update the selectedLead for consistency
        setSelectedLead(response.data);
        
        showSnackbar('Kommentar erfolgreich hinzugefügt!', 'success');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      showSnackbar('Fehler beim Hinzufügen des Kommentars', 'error');
    }  };

  const handleFormChange = (field: string, value: any) => {
    if (field.startsWith('company.')) {
      const companyField = field.replace('company.', '');
      setEditForm(prev => ({
        ...prev,
        company: {
          ...prev.company,
          [companyField]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };  const handleUserUpdated = () => {
    // Reload user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const handleOpenAccountModal = () => {
    console.log('🚀🚀🚀 Opening account modal...');
    setIsAccountModalOpen(true);
    console.log('🚀🚀🚀 Account modal state set to TRUE');
  };

  const handleCloseAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setLeads([]);
    setStats(null);
    setError('Sie wurden ausgeloggt.');
  };  const renderCurrentView = () => {
    const ComponentWrapper = ({ children }: { children: React.ReactNode }) => (
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        {children}
      </Suspense>
    );

    switch (currentView) {
      case 'overview':
        return (
          <ComponentWrapper>
            <Overview stats={stats || { totalLeads: 0 }} user={user} activities={activities} />
          </ComponentWrapper>
        );
      case 'leads':
        return (
          <ComponentWrapper>
            <div className="space-y-6">
              {stats && <StatsCards stats={stats} />}
              <LeadsTable 
                leads={leads}
                onEditLead={handleEditLead}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          </ComponentWrapper>
        );
      case 'users':
        return user?.role === 'admin' ? (
          <ComponentWrapper>
            <UserManagement currentUser={user} />
          </ComponentWrapper>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-lg">🔒</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zugriff verweigert</h3>
              <p className="text-gray-600 max-w-sm">
                Sie haben keine Berechtigung, diese Seite zu sehen. Nur Administratoren können auf die Benutzerverwaltung zugreifen.
              </p>
            </div>
          </div>
        );
      case 'companies':
        return (
          <ComponentWrapper>
            <CompanyManagement currentUser={user} />
          </ComponentWrapper>
        );
      default:
        // Für alle anderen Views (die disabled sind)
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-lg">🚧</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature in Entwicklung</h3>
              <p className="text-gray-600 max-w-sm">
                Diese Funktion wird derzeit entwickelt und wird in einer zukünftigen Version verfügbar sein.
              </p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onCollapseChange={setSidebarCollapsed}
      />

      {/* Main Content with dynamic left margin to account for fixed sidebar */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          user={user}
          currentView={currentView}
          onLogout={handleLogout}
          onOpenAccountModal={handleOpenAccountModal}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>      {/* Lead Edit Modal */}
      <Suspense fallback={null}>
        <LeadEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          selectedLead={selectedLead}
          editForm={editForm}
          onFormChange={handleFormChange}
          onSave={handleSaveLead}
          onAddComment={handleAddComment}
        />
      </Suspense>

      {/* Account Modal */}
      <Suspense fallback={null}>
        <AccountModal
          isOpen={isAccountModalOpen}
          onClose={handleCloseAccountModal}
          user={user}
          onUserUpdated={handleUserUpdated}
        />
      </Suspense>
    </div>
  );
};

export default Dashboard;
