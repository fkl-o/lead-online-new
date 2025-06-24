import { useState, useEffect } from 'react';
import { leadApi, authApi } from '@/lib/api';

// Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Overview from './components/Overview';
import StatsCards from './components/StatsCards';
import LeadsTable from './components/LeadsTable';
import LeadEditModal from './components/LeadEditModal';
import UserManagement from './components/UserManagement';
import { LoadingState, ErrorState } from './components/LoadingAndErrorStates';

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

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [currentView, setCurrentView] = useState('overview');

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      loadDashboardData();
    } else {
      setError('Bitte loggen Sie sich ein, um das Dashboard zu sehen.');
      setLoading(false);
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load leads and stats in parallel
      const [leadsResponse, statsResponse] = await Promise.all([
        leadApi.getLeads(),
        leadApi.getLeadStats()
      ]);

      if (leadsResponse.success) {
        setLeads(leadsResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
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
      alert('Fehler beim Aktualisieren des Lead-Status');
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
        alert('Lead erfolgreich aktualisiert!');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      alert('Fehler beim Speichern des Leads');
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
        
        alert('Kommentar erfolgreich hinzugefügt!');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Fehler beim Hinzufügen des Kommentars');
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
  };  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setLeads([]);
    setStats(null);
    setError('Sie wurden ausgeloggt.');
  };
  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview stats={stats || { totalLeads: 0 }} user={user} />;
      case 'leads':
        return (
          <div className="space-y-6">
            {stats && <StatsCards stats={stats} />}
            <LeadsTable 
              leads={leads}
              onEditLead={handleEditLead}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>
        );      case 'users':
        return user?.role === 'admin' ? (
          <UserManagement currentUser={user} />
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <TopBar
          user={user}
          currentView={currentView}
          onLogout={handleLogout}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderCurrentView()}
        </main>
      </div>

      {/* Lead Edit Modal */}
      <LeadEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedLead={selectedLead}
        editForm={editForm}
        onFormChange={handleFormChange}
        onSave={handleSaveLead}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default Dashboard;
