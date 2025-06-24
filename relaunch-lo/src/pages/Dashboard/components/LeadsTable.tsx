import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building, Mail, Phone, Globe, Star, Clock, AlertCircle, CheckCircle, Eye, Plus } from 'lucide-react';

interface Company {
  name?: string;
  website?: string;
  industry?: string;
  size?: string;
  phone?: string;
  address?: string;
}

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  value?: number;
  company?: Company;
}

interface LeadsTableProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onStatusUpdate: (leadId: string, newStatus: string) => void;
}

const LeadsTable = ({ leads, onEditLead, onStatusUpdate }: LeadsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 border-green-200';
      case 'proposal': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'negotiation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed-won': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed-lost': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'website': return <Globe className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-white/20">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lead Übersicht
          </CardTitle>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Neuer Lead
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {leads.length === 0 ? (
          <div className="text-center py-12 bg-white">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Noch keine Leads vorhanden.</p>
            <p className="text-gray-400 text-sm">Fügen Sie Ihren ersten Lead hinzu, um zu beginnen.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Lead</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Kontakt</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Quelle</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Priorität</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Erstellt</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Aktionen</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {leads.map((lead, index) => (
                  <tr key={lead._id} 
                      className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-2 rounded-full">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{lead.name}</p>
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
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getSourceIcon(lead.source)}
                        {lead.source}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={`${getStatusColor(lead.status)} border`}>
                        {getStatusLabel(lead.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant={lead.priority === 'high' ? 'destructive' : 
                               lead.priority === 'medium' ? 'default' : 'secondary'}
                        className="flex items-center gap-1 w-fit"
                      >
                        {getPriorityIcon(lead.priority)}
                        {lead.priority === 'high' ? 'Hoch' : 
                         lead.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(lead.createdAt).toLocaleDateString('de-DE')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onEditLead(lead)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Ansehen
                        </Button>
                        <select 
                          value={lead.status}
                          onChange={(e) => onStatusUpdate(lead._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="new">Neu</option>
                          <option value="contacted">Kontaktiert</option>
                          <option value="qualified">Qualifiziert</option>
                          <option value="proposal">Angebot</option>
                          <option value="negotiation">Verhandlung</option>
                          <option value="closed-won">Gewonnen</option>
                          <option value="closed-lost">Verloren</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsTable;
