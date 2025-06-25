import { useState, useEffect } from 'react';
import { userApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, 
  Mail,
  Lock,
  User,
  X,
  Shield,
  UserCog
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

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserUpdated: () => void;
}

const AccountModal = ({ isOpen, onClose, user, onUserUpdated }: AccountModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    salutation: null as 'herr' | 'frau' | null,
    profile: {
      company: '',
      companyUrl: '',
      phone: '',
      department: '',
      position: ''
    }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { showSnackbar } = useSnackbar();

  // Form mit User-Daten initialisieren
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        salutation: user.salutation || null,
        profile: {
          company: user.profile?.company || '',
          companyUrl: user.profile?.companyUrl || '',
          phone: user.profile?.phone || '',
          department: user.profile?.department || '',
          position: user.profile?.position || ''
        }
      });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      const updateData = {
        name: formData.name,
        email: formData.email,
        salutation: formData.salutation,
        profile: formData.profile
      };

      const response = await userApi.updateUser(user._id, updateData);
      
      if (response.success) {
        showSnackbar('Profil erfolgreich aktualisiert', 'success');
        onUserUpdated();
        onClose();
      } else {
        showSnackbar(response.message || 'Fehler beim Aktualisieren des Profils', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Fehler beim Aktualisieren des Profils', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('Die Passwörter stimmen nicht überein', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showSnackbar('Das Passwort muss mindestens 6 Zeichen lang sein', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const response = await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        showSnackbar('Passwort erfolgreich geändert', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        showSnackbar(response.message || 'Fehler beim Ändern des Passworts', 'error');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showSnackbar('Fehler beim Ändern des Passworts', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full flex flex-col overflow-hidden max-h-[90vh] transform transition-all duration-300"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <UserCog className="h-6 w-6 text-brand-600" />
            <h3 className="text-xl md:text-2xl font-bold text-neutral-900">
              Benutzer-Einstellungen
            </h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-auto pr-3 thin-scrollbar" type="always">
          <div className="px-1 pb-4">
            <div className="space-y-6">
              {/* Grunddaten */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-600" />
                  Grunddaten
                </h4>
                
                {/* Anrede + Name */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                  <div className="md:col-span-1">
                    <Label className="font-semibold text-slate-700 block mb-3">Anrede</Label>
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
                      <User className="h-4 w-4 text-brand-600" />
                      Name
                    </Label>
                    <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Vollständiger Name"
                        className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* E-Mail */}
                <div>
                  <Label htmlFor="email" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-600" />
                    E-Mail
                  </Label>
                  <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="benutzer@beispiel.com"
                      className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    />
                  </div>
                </div>
              </div>
              
              <hr className="border-gray-200" />

              {/* Profil Informationen */}
              <div className="space-y-6">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-600" />
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

              <hr className="border-gray-200" />

              {/* Passwort ändern */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-brand-600" />
                  Passwort ändern
                </h4>
                
                <div>
                  <Label htmlFor="currentPassword" className="font-semibold text-slate-700 block mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand-600" />
                    Aktuelles Passwort
                  </Label>
                  <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      placeholder="Aktuelles Passwort eingeben"
                      className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword" className="font-semibold text-slate-700 block mb-2">
                      Neues Passwort
                    </Label>
                    <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        placeholder="Neues Passwort"
                        className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="font-semibold text-slate-700 block mb-2">
                      Passwort bestätigen
                    </Label>
                    <div className="flex w-full rounded-md border border-input focus-within:ring-1 focus-within:ring-ring h-12">
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        placeholder="Passwort bestätigen"
                        className="flex-1 border-0 rounded-md focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Passwort ändern Button */}
                <div className="pt-2">
                  <Button 
                    type="button"
                    onClick={handleChangePassword} 
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3"
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Passwort ändern
                  </Button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={onClose}
                    className="px-6 py-3"
                    disabled={loading}
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    type="button"
                    onClick={handleUpdateProfile} 
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 font-semibold"
                    disabled={loading || !formData.name || !formData.email}
                  >
                    <UserCog className="h-4 w-4 mr-2" />
                    {loading ? 'Speichern...' : 'Profil speichern'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AccountModal;
