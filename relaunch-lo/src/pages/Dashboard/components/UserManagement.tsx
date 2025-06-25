import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Eye,
  EyeOff,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  X,
  Mail,
  UserCog,
  Briefcase
} from 'lucide-react';
import { useSnackbar } from '@/components/ui/snackbar';

// Einheitlicher Button-Style für Modals
const buttonStyle = "h-12 border-2 border-brand-600/20 data-[state=on]:bg-rose-50 data-[state=on]:text-brand-600 data-[state=on]:border-brand-600/100 data-[state=on]:shadow-[0_0_0_2px_#be123c] transition-all duration-200 ease-in-out";

type SelectableButtonProps = {
  icon?: React.ReactNode;
  label: string;
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
  isRadio?: boolean;
  name: string;
};

const SelectableButton = ({ icon, label, value, isSelected, onClick, isRadio, name }: SelectableButtonProps) => (
  <Button
    variant="outline"
    type="button"
    className={`flex-1 gap-2 ${buttonStyle}`}
    data-state={isSelected ? "on" : "off"}
    onClick={() => onClick(value)}
  >
    {isRadio && (
      <input
        type="radio"
        name={name}
        value={value}
        className="sr-only"
        checked={isSelected}
        onChange={() => {}}
      />
    )}
    {icon && icon}
    <span>{label}</span>
  </Button>
);

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'vertrieb' | 'kunde' | 'lead';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  salutation?: 'herr' | 'frau';
  profile?: {
    company?: string;
    companyUrl?: string;
    phone?: string;
    department?: string;
    position?: string;
  };
}

interface UserManagementProps {
  currentUser: any;
}

const UserManagement = ({ currentUser }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');// Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    salutation: null as 'herr' | 'frau' | null,
    role: 'vertrieb' as 'admin' | 'vertrieb' | 'kunde' | 'lead',
    isActive: true,
    profile: {
      company: '',
      companyUrl: '',
      phone: '',
      department: '',
      position: ''
    }
  });

  const isAdmin = currentUser?.role === 'admin';
  const { showSnackbar } = useSnackbar();
  // Load users from API
  const loadUsers = async () => {
    if (!isAdmin) return;
    
    try {
      setLoading(true);
      console.log('Lade Benutzer mit Filtern:', { filterRole, filterStatus, searchQuery });
      
      const response = await userApi.getUsers({
        page: 1,
        limit: 50,
        role: filterRole !== 'all' ? filterRole : undefined,
        isActive: filterStatus !== 'all' ? filterStatus === 'active' : undefined,
        search: searchQuery || undefined,
        sortBy: '-createdAt'
      });

      console.log('API Response:', response);

      if (response.success) {
        console.log('Geladene Benutzer:', response.data);
        setUsers(response.data || []);
      } else {
        console.error('Failed to load users:', response.message);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filterRole, filterStatus, searchQuery, isAdmin]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });  const handleCreateUser = async () => {
    try {
      const response = await userApi.createUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        salutation: formData.salutation,
        role: formData.role,
        profile: formData.profile
      });
      if (response.success) {
        showSnackbar('Benutzer erfolgreich erstellt!', 'success');
        setTimeout(() => {
          setIsCreateModalOpen(false);
          resetForm();
          loadUsers();
        }, 300);
      } else {
        showSnackbar(response.message || 'Fehler beim Erstellen des Benutzers', 'error');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showSnackbar('Fehler beim Erstellen des Benutzers', 'error');
    }
  };  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const response = await userApi.updateUser(selectedUser._id, {
        name: formData.name,
        email: formData.email,
        salutation: formData.salutation,
        role: formData.role,
        isActive: formData.isActive,
        profile: formData.profile
      });
      if (response.success) {
        showSnackbar('Benutzer erfolgreich aktualisiert!', 'success');
        setTimeout(() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
          resetForm();
          loadUsers();
        }, 300);
      } else {
        showSnackbar(response.message || 'Fehler beim Aktualisieren des Benutzers', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showSnackbar('Fehler beim Aktualisieren des Benutzers', 'error');
    }
  };  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Benutzer deaktivieren möchten? (Der Benutzer wird nicht gelöscht, sondern nur deaktiviert)')) return;
    try {
      setIsDeleting(userId);
      const response = await userApi.deleteUser(userId);
      if (response.success) {
        setUsers(prevUsers => prevUsers.map(user => user._id === userId ? { ...user, isActive: false } : user));
        setIsActionsModalOpen(false);
        setSelectedUser(null);
        showSnackbar('Benutzer erfolgreich deaktiviert!', 'success');
        setTimeout(() => loadUsers(), 300);
      } else {
        showSnackbar(response.message || 'Fehler beim Deaktivieren des Benutzers', 'error');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      showSnackbar('Fehler beim Deaktivieren des Benutzers', 'error');
    } finally {
      setIsDeleting(null);
    }
  };

  const handlePermanentDeleteUser = async (userId: string) => {
    if (!confirm('⚠️ WARNUNG: Möchten Sie diesen Benutzer PERMANENT löschen?\n\nDies kann NICHT rückgängig gemacht werden!\nAlle Daten des Benutzers werden unwiderruflich gelöscht.')) return;
    try {
      setIsDeleting(userId);
      const response = await userApi.permanentDeleteUser(userId);
      if (response.success) {
        setIsActionsModalOpen(false);
        setSelectedUser(null);
        showSnackbar('Benutzer permanent gelöscht!', 'success');
        setTimeout(() => loadUsers(), 300);
      } else {
        showSnackbar(response.message || 'Fehler beim permanenten Löschen des Benutzers', 'error');
      }
    } catch (error) {
      console.error('Error permanently deleting user:', error);
      showSnackbar('Fehler beim permanenten Löschen des Benutzers', 'error');
    } finally {
      setIsDeleting(null);
    }
  };const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await userApi.toggleUserStatus(userId, !isActive);
      if (response.success) {
        setIsActionsModalOpen(false);
        setSelectedUser(null);
        showSnackbar(`Benutzer erfolgreich ${!isActive ? 'aktiviert' : 'deaktiviert'}!`, 'success');
        setTimeout(() => loadUsers(), 300);
      } else {
        showSnackbar(response.message || 'Fehler beim Ändern des Benutzerstatus', 'error');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      showSnackbar('Fehler beim Ändern des Benutzerstatus', 'error');
    }
  };const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      salutation: null,
      role: 'vertrieb',
      isActive: true,
      profile: {
        company: '',
        companyUrl: '',
        phone: '',
        department: '',
        position: ''
      }
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,      password: '',
      salutation: user.salutation || null,
      role: user.role,
      isActive: user.isActive,
      profile: {
        company: user.profile?.company || '',
        companyUrl: user.profile?.companyUrl || '',
        phone: user.profile?.phone || '',
        department: user.profile?.department || '',
        position: user.profile?.position || ''
      }
    });
    setIsEditModalOpen(true);
  };

  const openActionsModal = (user: User) => {
    setSelectedUser(user);
    setIsActionsModalOpen(true);
  };
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'vertrieb': return 'secondary';
      case 'kunde': return 'secondary';
      case 'lead': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'vertrieb': return 'Vertrieb';
      case 'kunde': return 'Kunde';
      case 'lead': return 'Lead';
      default: return role;
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser) return;

    if (newPassword !== confirmPassword) {
      showSnackbar('Die Passwörter stimmen nicht überein!', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showSnackbar('Das Passwort muss mindestens 6 Zeichen lang sein!', 'error');
      return;
    }

    try {
      const response = await userApi.resetPassword(selectedUser._id, newPassword);

      if (response.success) {
        showSnackbar('Passwort erfolgreich zurückgesetzt!', 'success');
        setIsPasswordResetModalOpen(false);
        setSelectedUser(null);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showSnackbar(response.message || 'Fehler beim Zurücksetzen des Passworts', 'error');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showSnackbar('Fehler beim Zurücksetzen des Passworts', 'error');
    }
  };

  const openPasswordResetModal = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setIsPasswordResetModalOpen(true);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Zugriff verweigert</h3>
          <p className="text-gray-500">Sie haben keine Berechtigung, Benutzer zu verwalten.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-600 mx-auto mb-4" />
          <p className="text-gray-500">Lade Benutzer...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button onClick={openCreateModal} className="bg-brand-600 hover:bg-brand-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Neuer Benutzer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Benutzer</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktive Benutzer</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administratoren</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inaktive Benutzer</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => !u.isActive).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter & Suche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Nach Name oder E-Mail suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Rolle filtern" />
              </SelectTrigger>              <SelectContent className="bg-white">
                <SelectItem value="all">Alle Rollen</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="vertrieb">Vertrieb</SelectItem>
                <SelectItem value="kunde">Kunde</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48 bg-white">
                <SelectValue placeholder="Status filtern" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="active">Aktiv</SelectItem>
                <SelectItem value="inactive">Inaktiv</SelectItem>
              </SelectContent>
            </Select>            <Button variant="outline" onClick={() => {
              console.log('Manueller Refresh gestartet');
              loadUsers();
            }}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benutzer ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Benutzer</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Erstellt</TableHead>
                  <TableHead>Letzter Login</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            {user.profile?.position || 'Keine Position'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'secondary'}>
                        {user.isActive ? 'Aktiv' : 'Inaktiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('de-DE')}
                    </TableCell>
                    <TableCell>
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('de-DE')
                        : 'Nie'
                      }
                    </TableCell>                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={() => openActionsModal(user)}
                      >
                        <span className="sr-only">Aktionen öffnen</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Benutzer gefunden</h3>
              <p className="text-gray-500">Keine Benutzer entsprechen den aktuellen Filterkriterien.</p>
            </div>
          )}
        </CardContent>
      </Card>      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div
          onClick={() => setIsCreateModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <UserPlus className="h-6 w-6 text-brand-600" />
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Neuen Benutzer erstellen
                </h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsCreateModalOpen(false)} 
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
              <div className="px-1 pb-4">
                <form className="space-y-6">                  {/* Grunddaten */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand-600" />
                      Grunddaten
                    </h4>
                    
                    {/* Anrede + Name */}                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <div className="md:col-span-1">
                        <Label className="font-semibold text-slate-700 block mb-3">Anrede *</Label>
                        <div className="flex gap-2">
                          {['herr', 'frau'].map(option => (
                            <SelectableButton
                              key={option}
                              label={option === 'herr' ? 'Herr' : 'Frau'}
                              value={option}
                              isSelected={formData.salutation === option}
                              onClick={(value) => setFormData({...formData, salutation: value as 'herr' | 'frau'})}
                              isRadio={true}
                              name="salutation"
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="name" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-brand-600" />
                          Name *
                        </Label>
                        <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Vollständiger Name"
                            className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            required
                          />
                        </div>
                      </div>
                    </div>                    {/* E-Mail und Passwort */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-brand-600" />
                          E-Mail *
                        </Label>
                        <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="benutzer@beispiel.com"
                            className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="password" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-brand-600" />
                          Passwort *
                        </Label>
                        <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Sicheres Passwort"
                            className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            required
                          />
                        </div>
                      </div>
                    </div>                    {/* Rolle - Vollbreite */}
                    <div>
                      <Label className="font-semibold text-slate-700 block mb-3 flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-brand-600" />
                        Rolle
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: 'admin', label: 'Admin', icon: <Shield className="h-4 w-4 text-brand-600" /> },
                          { value: 'vertrieb', label: 'Vertrieb', icon: <Users className="h-4 w-4 text-brand-600" /> },
                          { value: 'kunde', label: 'Kunde', icon: <UserCog className="h-4 w-4 text-brand-600" /> },
                          { value: 'lead', label: 'Lead', icon: <Briefcase className="h-4 w-4 text-brand-600" /> },
                        ].map(option => (
                          <SelectableButton
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            icon={option.icon}
                            isSelected={formData.role === option.value}
                            onClick={(value) => setFormData({...formData, role: value as 'admin' | 'vertrieb' | 'kunde' | 'lead'})}
                            isRadio={true}
                            name="role"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-gray-200" />                  {/* Profil Informationen */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-brand-600" />
                      Profil Informationen
                    </h4>
                    
                    {/* Unternehmensangaben */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Unternehmensangaben</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company" className="font-semibold text-slate-700 block mb-2">
                            Unternehmen
                          </Label>
                          <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                            <Input
                              id="company"
                              value={formData.profile.company}
                              onChange={(e) => setFormData({
                                ...formData, 
                                profile: {...formData.profile, company: e.target.value}
                              })}
                              placeholder="Firmenname"
                              className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="companyUrl" className="font-semibold text-slate-700 block mb-2">
                            Unternehmens-URL
                          </Label>
                          <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                            <Input
                              id="companyUrl"
                              value={formData.profile.companyUrl}
                              onChange={(e) => setFormData({
                                ...formData, 
                                profile: {...formData.profile, companyUrl: e.target.value}
                              })}
                              placeholder="https://www.beispiel.de"
                              className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Kontakt & Position */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Kontakt & Position</h5>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="phone" className="font-semibold text-slate-700 block mb-2">
                            Telefon
                          </Label>
                          <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                            <Input
                              id="phone"
                              value={formData.profile.phone}
                              onChange={(e) => setFormData({
                                ...formData, 
                                profile: {...formData.profile, phone: e.target.value}
                              })}
                              placeholder="+49 123 456789"
                              className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="department" className="font-semibold text-slate-700 block mb-2">
                              Abteilung
                            </Label>
                            <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                              <Input
                                id="department"
                                value={formData.profile.department}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  profile: {...formData.profile, department: e.target.value}
                                })}
                                placeholder="Marketing, Vertrieb, etc."
                                className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="position" className="font-semibold text-slate-700 block mb-2">
                              Position
                            </Label>
                            <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                              <Input
                                id="position"
                                value={formData.profile.position}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  profile: {...formData.profile, position: e.target.value}
                                })}
                                placeholder="Vertriebsleiter, etc."
                                className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="px-6 py-3"
                      >
                        Abbrechen
                      </Button>                      <Button 
                        type="button"
                        onClick={handleCreateUser} 
                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 font-semibold"
                        disabled={!formData.name || !formData.email || !formData.password || !formData.salutation}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Benutzer erstellen
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div
          onClick={() => setIsEditModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Edit className="h-6 w-6 text-brand-600" />
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Benutzer bearbeiten
                </h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsEditModalOpen(false)} 
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
              <div className="px-1 pb-4">
                <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                  {/* Grunddaten */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Users className="h-4 w-4 text-brand-600" />
                      Grunddaten
                    </h4>
                      {/* Anrede + Name */}                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      <div className="md:col-span-1">
                        <Label className="font-semibold text-slate-700 block mb-3">Anrede *</Label>
                        <div className="flex gap-2">
                          {['herr', 'frau'].map(option => (
                            <SelectableButton
                              key={option}
                              label={option === 'herr' ? 'Herr' : 'Frau'}
                              value={option}
                              isSelected={formData.salutation === option}
                              onClick={(value) => setFormData({...formData, salutation: value as 'herr' | 'frau'})}
                              isRadio={true}
                              name="edit-salutation"
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <Label htmlFor="edit-name" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4 text-brand-600" />
                          Name *
                        </Label>
                        <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Vollständiger Name"
                            className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* E-Mail */}
                    <div>
                      <Label htmlFor="edit-email" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-brand-600" />
                        E-Mail *
                      </Label>
                      <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                        <Input
                          id="edit-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="benutzer@beispiel.com"
                          className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                          required
                        />
                      </div>
                    </div>

                    {/* Rolle - Vollbreite */}
                    <div>
                      <Label className="font-semibold text-slate-700 block mb-3 flex items-center gap-2">
                        <UserCog className="h-4 w-4 text-brand-600" />
                        Rolle
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          { value: 'admin', label: 'Admin', icon: <Shield className="h-4 w-4 text-brand-600" /> },
                          { value: 'vertrieb', label: 'Vertrieb', icon: <Users className="h-4 w-4 text-brand-600" /> },
                          { value: 'kunde', label: 'Kunde', icon: <UserCog className="h-4 w-4 text-brand-600" /> },
                          { value: 'lead', label: 'Lead', icon: <Briefcase className="h-4 w-4 text-brand-600" /> },
                        ].map(option => (
                          <SelectableButton
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            icon={option.icon}
                            isSelected={formData.role === option.value}
                            onClick={(value) => setFormData({...formData, role: value as 'admin' | 'vertrieb' | 'kunde' | 'lead'})}
                            isRadio={true}
                            name="edit-role"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-gray-200" />

                  {/* Profil Informationen */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-brand-600" />
                      Profil Informationen
                    </h4>
                    
                    {/* Unternehmensangaben */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Unternehmensangaben</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="edit-company" className="font-semibold text-slate-700 block mb-2">
                            Unternehmen
                          </Label>
                          <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                            <Input
                              id="edit-company"
                              value={formData.profile.company}
                              onChange={(e) => setFormData({
                                ...formData, 
                                profile: {...formData.profile, company: e.target.value}
                              })}
                              placeholder="Firmenname"
                              className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="edit-companyUrl" className="font-semibold text-slate-700 block mb-2">
                            Unternehmens-URL
                          </Label>
                          <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                            <Input
                              id="edit-companyUrl"
                              value={formData.profile.companyUrl}
                              onChange={(e) => setFormData({
                                ...formData, 
                                profile: {...formData.profile, companyUrl: e.target.value}
                              })}
                              placeholder="https://www.beispiel.de"
                              className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Kontakt & Position */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Kontakt & Position</h5>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-phone" className="font-semibold text-slate-700 block mb-2">
                            Telefon
                          </Label>
                          <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                            <Input
                              id="edit-phone"
                              value={formData.profile.phone}
                              onChange={(e) => setFormData({
                                ...formData, 
                                profile: {...formData.profile, phone: e.target.value}
                              })}
                              placeholder="+49 123 456789"
                              className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-department" className="font-semibold text-slate-700 block mb-2">
                              Abteilung
                            </Label>
                            <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                              <Input
                                id="edit-department"
                                value={formData.profile.department}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  profile: {...formData.profile, department: e.target.value}
                                })}
                                placeholder="Marketing, Vertrieb, etc."
                                className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-position" className="font-semibold text-slate-700 block mb-2">
                              Position
                            </Label>
                            <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                              <Input
                                id="edit-position"
                                value={formData.profile.position}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  profile: {...formData.profile, position: e.target.value}
                                })}
                                placeholder="Vertriebsleiter, etc."
                                className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="pt-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-6 py-3"
                      >
                        Abbrechen
                      </Button>                      <Button 
                        type="button"
                        onClick={handleUpdateUser} 
                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 font-semibold"
                        disabled={!formData.name || !formData.email || !formData.salutation}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Änderungen speichern
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      {/* Actions Modal */}
      {isActionsModalOpen && selectedUser && (
        <div
          onClick={() => setIsActionsModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
                  <span className="text-white font-semibold text-sm">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsActionsModalOpen(false)} 
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>            <div className="space-y-2">
              {/* Bearbeiten Button */}
              <Button
                variant="ghost"
                onClick={() => {
                  setIsActionsModalOpen(false);
                  openEditModal(selectedUser);
                }}
                className="w-full justify-start h-11 px-4 text-left hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <Edit className="h-4 w-4 mr-3 text-gray-600" />
                <span className="text-gray-700 font-medium">Benutzer bearbeiten</span>
              </Button>

              {/* Status Toggle Button */}
              <Button
                variant="ghost"
                onClick={async () => {
                  await handleToggleUserStatus(selectedUser._id, selectedUser.isActive);
                }}
                className="w-full justify-start h-11 px-4 text-left hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                {selectedUser.isActive ? (
                  <EyeOff className="h-4 w-4 mr-3 text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 mr-3 text-gray-600" />
                )}
                <span className="text-gray-700 font-medium">
                  {selectedUser.isActive ? 'Benutzer deaktivieren' : 'Benutzer aktivieren'}
                </span>
              </Button>

              {/* Passwort zurücksetzen Button */}
              <Button
                variant="ghost"
                onClick={() => {
                  setIsActionsModalOpen(false);
                  openPasswordResetModal(selectedUser);
                }}
                className="w-full justify-start h-11 px-4 text-left hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <Shield className="h-4 w-4 mr-3 text-gray-600" />
                <span className="text-gray-700 font-medium">Passwort zurücksetzen</span>
              </Button>

              {/* Trennlinie vor gefährlichen Aktionen */}
              <div className="border-t border-gray-200 my-3"></div>

              {/* Deaktivieren Button */}
              <Button
                variant="ghost"
                onClick={async () => {
                  await handleDeleteUser(selectedUser._id);
                }}
                className="w-full justify-start h-11 px-4 text-left hover:bg-orange-50 border border-gray-200 hover:border-orange-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting === selectedUser._id || !selectedUser.isActive}
              >
                <EyeOff className="h-4 w-4 mr-3 text-orange-600" />
                <span className="text-orange-700 font-medium">
                  {isDeleting === selectedUser._id ? 'Deaktiviere...' : 
                   !selectedUser.isActive ? 'Bereits deaktiviert' : 'Benutzer deaktivieren'}
                </span>
              </Button>

              {/* Permanent löschen Button */}
              <Button
                variant="ghost"
                onClick={async () => {
                  await handlePermanentDeleteUser(selectedUser._id);
                }}
                className="w-full justify-start h-11 px-4 text-left hover:bg-red-50 border border-gray-200 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting === selectedUser._id}
              >
                <Trash2 className="h-4 w-4 mr-3 text-red-600" />
                <span className="text-red-700 font-medium">
                  {isDeleting === selectedUser._id ? 'Lösche permanent...' : 'Permanent löschen'}
                </span>
              </Button>
            </div>

            {/* Info Card */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                  {getRoleDisplayName(selectedUser.role)}
                </Badge>
                <Badge variant={selectedUser.isActive ? 'default' : 'secondary'}>
                  {selectedUser.isActive ? 'Aktiv' : 'Inaktiv'}
                </Badge>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {selectedUser.profile?.company && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-3 w-3" />
                    <span>{selectedUser.profile.company}</span>
                  </div>
                )}
                {selectedUser.profile?.position && (
                  <div className="flex items-center gap-2">
                    <UserCog className="h-3 w-3" />
                    <span>{selectedUser.profile.position}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>Erstellt:</span>
                  <span>{new Date(selectedUser.createdAt).toLocaleDateString('de-DE')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passwort zurücksetzen Modal */}
      {isPasswordResetModalOpen && (
        <div
          onClick={() => setIsPasswordResetModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-brand-600" />
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
                  Passwort zurücksetzen
                </h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsPasswordResetModalOpen(false)} 
                className="rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="new-password" className="font-semibold text-slate-700 block mb-2">
                  Neues Passwort
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Neues sicheres Passwort"
                    className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password" className="font-semibold text-slate-700 block mb-2">
                  Passwort bestätigen
                </Label>
                <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Passwort bestätigen"
                    className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsPasswordResetModalOpen(false)}
                className="px-6 py-2"
              >
                Abbrechen
              </Button>
              <Button 
                onClick={handleResetPassword} 
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2"
                disabled={!newPassword || !confirmPassword}
              >
                Passwort zurücksetzen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
