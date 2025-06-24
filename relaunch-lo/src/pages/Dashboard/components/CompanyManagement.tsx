import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Building2, 
  Plus,
  Search,
  Download,
  Upload,
  MoreHorizontal,
  Edit,
  Trash2,
  Mail,
  Phone,
  Globe,
  Users,
  Calendar,
  Star,
  ExternalLink
} from 'lucide-react';

interface Company {
  _id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  status: 'active' | 'inactive' | 'prospect';
  leadCount: number;
  totalValue: number;
  lastContact?: string;
  createdAt: string;
  contactPerson?: {
    name: string;
    email: string;
    position: string;
  };
}

interface CompanyManagementProps {
  currentUser: any;
}

// Mock data
const mockCompanies: Company[] = [
  {
    _id: '1',
    name: 'TechStart GmbH',
    website: 'https://techstart.de',
    industry: 'Technologie',
    size: '50-100',
    phone: '+49 30 12345678',
    email: 'info@techstart.de',
    address: 'Berliner Str. 123, 10115 Berlin',
    description: 'Innovative Software-Lösungen für KMU',
    status: 'active',
    leadCount: 12,
    totalValue: 45000,
    lastContact: '2024-01-15T10:30:00Z',
    createdAt: '2023-05-20T09:00:00Z',
    contactPerson: {
      name: 'Max Müller',
      email: 'max.mueller@techstart.de',
      position: 'Geschäftsführer'
    }
  },
  {
    _id: '2',
    name: 'Digital Solutions AG',
    website: 'https://digitalsolutions.com',
    industry: 'IT-Beratung',
    size: '100-500',
    phone: '+49 89 98765432',
    email: 'kontakt@digitalsolutions.com',
    address: 'Maximilianstr. 45, 80539 München',
    description: 'Digitale Transformation für Unternehmen',
    status: 'active',
    leadCount: 8,
    totalValue: 78000,
    lastContact: '2024-01-14T14:20:00Z',
    createdAt: '2023-03-15T11:30:00Z',
    contactPerson: {
      name: 'Anna Weber',
      email: 'anna.weber@digitalsolutions.com',
      position: 'Head of Sales'
    }
  },
  {
    _id: '3',
    name: 'StartUp Innovate',
    website: 'https://startup-innovate.com',
    industry: 'E-Commerce',
    size: '10-50',
    phone: '+49 40 55667788',
    email: 'hello@startup-innovate.com',
    address: 'Hafenstr. 89, 20359 Hamburg',
    description: 'Innovative E-Commerce Plattformen',
    status: 'prospect',
    leadCount: 3,
    totalValue: 15000,
    lastContact: '2024-01-10T16:45:00Z',
    createdAt: '2023-11-02T14:15:00Z',
    contactPerson: {
      name: 'Tom Schmidt',
      email: 'tom@startup-innovate.com',
      position: 'CTO'
    }
  }
];

const CompanyManagement = ({ currentUser: _currentUser }: CompanyManagementProps) => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    size: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    status: 'prospect' as 'active' | 'inactive' | 'prospect',
    contactPerson: {
      name: '',
      email: '',
      position: ''
    }
  });

  // Get unique industries for filter
  const industries = Array.from(new Set(companies.map(c => c.industry).filter(Boolean)));

  // Filter companies
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.contactPerson?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || company.industry === filterIndustry;
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const handleCreateCompany = () => {
    const newCompany: Company = {
      _id: Date.now().toString(),
      ...formData,
      leadCount: 0,
      totalValue: 0,
      createdAt: new Date().toISOString()
    };

    setCompanies([...companies, newCompany]);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      website: company.website || '',
      industry: company.industry || '',
      size: company.size || '',
      phone: company.phone || '',
      email: company.email || '',
      address: company.address || '',
      description: company.description || '',
      status: company.status,
      contactPerson: company.contactPerson || { name: '', email: '', position: '' }
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCompany = () => {
    if (!selectedCompany) return;

    const updatedCompanies = companies.map(company =>
      company._id === selectedCompany._id
        ? { ...company, ...formData }
        : company
    );

    setCompanies(updatedCompanies);
    setIsEditModalOpen(false);
    setSelectedCompany(null);
    resetForm();
  };

  const handleDeleteCompany = (companyId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Unternehmen löschen möchten?')) {
      setCompanies(companies.filter(company => company._id !== companyId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      website: '',
      industry: '',
      size: '',
      phone: '',
      email: '',
      address: '',
      description: '',
      status: 'prospect',
      contactPerson: {
        name: '',
        email: '',
        position: ''
      }
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'prospect': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv';
      case 'inactive': return 'Inaktiv';
      case 'prospect': return 'Interessent';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamt Unternehmen</p>
                <p className="text-3xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktive Kunden</p>
                <p className="text-3xl font-bold text-gray-900">
                  {companies.filter(c => c.status === 'active').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gesamtwert</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(companies.reduce((sum, c) => sum + c.totalValue, 0))}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interessenten</p>
                <p className="text-3xl font-bold text-gray-900">
                  {companies.filter(c => c.status === 'prospect').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold">Unternehmensverwaltung</CardTitle>
              <p className="text-gray-600 mt-1">Verwalten Sie Ihre Kunden und Interessenten</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-600 hover:bg-brand-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Neues Unternehmen
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Neues Unternehmen erstellen</DialogTitle>
                    <DialogDescription>
                      Erfassen Sie die Informationen für ein neues Unternehmen.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Firmenname *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Firmenname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Branche</Label>
                        <Input
                          id="industry"
                          value={formData.industry}
                          onChange={(e) => setFormData({...formData, industry: e.target.value})}
                          placeholder="IT, Marketing, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Unternehmensgröße</Label>
                        <Select value={formData.size} onValueChange={(value) => setFormData({...formData, size: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Größe auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 Mitarbeiter</SelectItem>
                            <SelectItem value="10-50">10-50 Mitarbeiter</SelectItem>
                            <SelectItem value="50-100">50-100 Mitarbeiter</SelectItem>
                            <SelectItem value="100-500">100-500 Mitarbeiter</SelectItem>
                            <SelectItem value="500+">500+ Mitarbeiter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+49 30 12345678"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="info@unternehmen.de"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Straße, PLZ Ort"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Beschreibung</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Kurze Beschreibung des Unternehmens..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'prospect') => setFormData({...formData, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status auswählen" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospect">Interessent</SelectItem>
                          <SelectItem value="active">Aktiver Kunde</SelectItem>
                          <SelectItem value="inactive">Inaktiv</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-medium">Hauptansprechpartner</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Name</Label>
                          <Input
                            id="contact-name"
                            value={formData.contactPerson.name}
                            onChange={(e) => setFormData({
                              ...formData,
                              contactPerson: {...formData.contactPerson, name: e.target.value}
                            })}
                            placeholder="Max Mustermann"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contact-position">Position</Label>
                          <Input
                            id="contact-position"
                            value={formData.contactPerson.position}
                            onChange={(e) => setFormData({
                              ...formData,
                              contactPerson: {...formData.contactPerson, position: e.target.value}
                            })}
                            placeholder="Geschäftsführer"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">E-Mail</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={formData.contactPerson.email}
                          onChange={(e) => setFormData({
                            ...formData,
                            contactPerson: {...formData.contactPerson, email: e.target.value}
                          })}
                          placeholder="max@unternehmen.de"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button onClick={handleCreateCompany} className="bg-brand-600 hover:bg-brand-700">
                      Unternehmen erstellen
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Unternehmen suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Branche" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Branchen</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry || ''}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="active">Aktiv</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                  <SelectItem value="prospect">Interessent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Companies Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unternehmen</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Branche</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Leads</TableHead>
                <TableHead>Wert</TableHead>
                <TableHead>Letzter Kontakt</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-2">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{company.name}</p>
                          {company.website && (
                            <a 
                              href={company.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{company.size}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.contactPerson ? (
                      <div>
                        <p className="font-medium text-gray-900">{company.contactPerson.name}</p>
                        <p className="text-sm text-gray-500">{company.contactPerson.position}</p>
                        <p className="text-sm text-gray-500">{company.contactPerson.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400">Kein Kontakt</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.industry && (
                      <Badge variant="outline">{company.industry}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(company.status)}>
                      {getStatusLabel(company.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{company.leadCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{formatCurrency(company.totalValue)}</span>
                  </TableCell>
                  <TableCell>
                    {company.lastContact ? formatDate(company.lastContact) : 'Nie'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Bearbeiten
                        </DropdownMenuItem>
                        {company.email && (
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            E-Mail senden
                          </DropdownMenuItem>
                        )}
                        {company.phone && (
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Anrufen
                          </DropdownMenuItem>
                        )}
                        {company.website && (
                          <DropdownMenuItem>
                            <Globe className="mr-2 h-4 w-4" />
                            Website besuchen
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCompany(company._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredCompanies.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Unternehmen gefunden</h3>
              <p className="text-gray-600">
                {searchQuery || filterIndustry !== 'all' || filterStatus !== 'all'
                  ? 'Versuchen Sie, Ihre Suchkriterien anzupassen.'
                  : 'Erstellen Sie Ihr erstes Unternehmen, um zu beginnen.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Company Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Unternehmen bearbeiten</DialogTitle>
            <DialogDescription>
              Bearbeiten Sie die Unternehmensinformationen.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Same form fields as create modal */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Firmenname *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Firmenname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-website">Website</Label>
                <Input
                  id="edit-website"
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            {/* Rest of the form fields... */}
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'prospect') => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Interessent</SelectItem>
                  <SelectItem value="active">Aktiver Kunde</SelectItem>
                  <SelectItem value="inactive">Inaktiv</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleUpdateCompany} className="bg-brand-600 hover:bg-brand-700">
              Änderungen speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyManagement;
