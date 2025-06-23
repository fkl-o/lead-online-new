import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { leadApi, authApi } from '@/lib/api';
import { Users, Calendar, BarChart3, Target } from 'lucide-react';

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
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  source: string;
  status: string;
  priority: string;
  createdAt: string;
  company?: Company;
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
  };
  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-emerald-100 text-emerald-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Neu';
      case 'contacted': return 'Kontaktiert';
      case 'qualified': return 'Qualifiziert';
      case 'proposal': return 'Angebot';
      case 'negotiation': return 'Verhandlung';
      case 'closed-won': return 'Gewonnen';
      case 'closed-lost': return 'Verloren';
      default: return status;
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setLeads([]);
    setStats(null);
    setError('Sie wurden ausgeloggt.');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Fehler</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.href = '/'} className="w-full">
              Zur Startseite
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LeadGen Pro Dashboard</h1>
            {user && <p className="text-gray-600">Willkommen, {user.name}!</p>}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Ausloggen
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gesamt Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalLeads || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gewonnene Leads</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.statusStats?.find(s => s._id === 'closed-won')?.count || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.conversionStats?.conversionRate?.toFixed(1) || 0}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gesamt Wert</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{stats.conversionStats?.totalValue?.toLocaleString('de-DE') || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Alle Leads</CardTitle>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Noch keine Leads vorhanden.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">E-Mail</th>
                      <th className="text-left py-2">Quelle</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Priorität</th>
                      <th className="text-left py-2">Erstellt</th>
                      <th className="text-left py-2">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead._id} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            {lead.company?.name && (
                              <p className="text-sm text-gray-500">{lead.company.name}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-2">
                          <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                            {lead.email}
                          </a>
                        </td>
                        <td className="py-2">
                          <Badge variant="outline">{lead.source}</Badge>
                        </td>
                        <td className="py-2">
                          <Badge className={getStatusColor(lead.status)}>
                            {getStatusLabel(lead.status)}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <Badge 
                            variant={lead.priority === 'high' ? 'destructive' : 
                                   lead.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {lead.priority === 'high' ? 'Hoch' : 
                             lead.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                          </Badge>
                        </td>
                        <td className="py-2 text-sm text-gray-500">
                          {new Date(lead.createdAt).toLocaleDateString('de-DE')}
                        </td>
                        <td className="py-2">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="new">Neu</option>
                            <option value="contacted">Kontaktiert</option>
                            <option value="qualified">Qualifiziert</option>
                            <option value="proposal">Angebot</option>
                            <option value="negotiation">Verhandlung</option>
                            <option value="closed-won">Gewonnen</option>
                            <option value="closed-lost">Verloren</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
