import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Mail, Phone, Globe, Star, Clock, CheckCircle, Eye, MessageSquare, Target } from 'lucide-react';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CustomerViewProps {
  user: User;
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
}

const CustomerView = ({ user, leads, onEditLead }: CustomerViewProps) => {

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'website': return <Globe className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'automation': return <Target className="h-4 w-4" />;
      case 'digitalization': return <Building className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source.toLowerCase()) {
      case 'automation': return 'Marketing Automation';
      case 'digitalization': return 'Digitalisierung';
      case 'website': return 'Webentwicklung';
      case 'contact': return 'Kontaktformular';
      default: return source;
    }
  };

  const handleViewLead = (lead: Lead) => {
    onEditLead(lead);
  };

  // Filter leads for the current customer (additional safety check)
  const customerLeads = leads.filter(lead => 
    lead.email === user.email || 
    (lead.company?.name && user.email.includes(lead.company.name.toLowerCase().replace(/\s+/g, '')))
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Willkommen, {user.name}!
              </h2>
              <p className="text-gray-600">
                Hier finden Sie eine Übersicht Ihrer Anfragen und können den aktuellen Status einsehen.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamt Anfragen</p>
                <p className="text-3xl font-bold text-gray-900">{customerLeads.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Bearbeitung</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {customerLeads.filter(lead => ['new', 'contacted', 'qualified', 'proposal', 'negotiation'].includes(lead.status)).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Abgeschlossen</p>
                <p className="text-3xl font-bold text-green-600">
                  {customerLeads.filter(lead => ['closed-won', 'closed-lost'].includes(lead.status)).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-white/20">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Meine Anfragen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {customerLeads.length === 0 ? (
            <div className="text-center py-12 bg-white">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Noch keine Anfragen vorhanden.</p>
              <p className="text-gray-400 text-sm">Ihre Anfragen werden hier angezeigt, sobald sie bearbeitet werden.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Service</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Kontakt</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Erstellt</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {customerLeads.map((lead, index) => (
                    <tr key={lead._id} 
                        className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-full">
                            {getSourceIcon(lead.source)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{getSourceLabel(lead.source)}</p>
                            {lead.company?.name && (
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                {lead.company.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <a href={`mailto:${lead.email}`} 
                             className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </a>
                          {lead.phone && (
                            <p className="text-gray-500 flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(lead.createdAt).toLocaleDateString('de-DE')}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewLead(lead)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
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
  );
};

export default CustomerView;
